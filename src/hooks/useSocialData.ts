import { useState, useCallback, useMemo } from 'react';
import { SocialData, parseNodeXLData } from '../utils/csvParser';

export interface FilterState {
    keyword: string;
    sentiment: string[];
    platform: string;
    topic: string;
    minFollowers: number;
    sortBy: string;
    dateRange: [string, string];
}

export const useSocialData = () => {
    const [rawData, setRawData] = useState<SocialData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        keyword: '',
        sentiment: ['Pos', 'Neu', 'Neg'],
        platform: 'All Platforms',
        topic: 'All Topics',
        minFollowers: 0,
        sortBy: 'Betweenness Centrality',
        dateRange: ['', ''],
    });

    const processFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            const text = await file.text();
            const parsed = await parseNodeXLData(text);
            setRawData(parsed);
        } catch (err) {
            setError('Failed to parse CSV file. Please ensure it follows the NodeXL format.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const filteredData = useMemo(() => {
        if (!rawData) return null;

        let filteredNodes = rawData.nodes.filter((node) => {
            const matchesKeyword = node.label.toLowerCase().includes(filters.keyword.toLowerCase());
            const matchesSentiment = filters.sentiment.includes(node.sentiment);
            const matchesPlatform = filters.platform === 'All Platforms' ||
                (node.platform && node.platform.toLowerCase() === filters.platform.toLowerCase());
            const matchesTopic = filters.topic === 'All Topics' ||
                (node.topic && node.topic.toLowerCase() === filters.topic.toLowerCase());
            const matchesFollowers = (node.followers || 0) >= filters.minFollowers;

            let matchesDate = true;
            if (node.date && (filters.dateRange[0] || filters.dateRange[1])) {
                const nodeDate = new Date(node.date);
                if (filters.dateRange[0]) {
                    const startDate = new Date(filters.dateRange[0]);
                    if (nodeDate < startDate) matchesDate = false;
                }
                if (filters.dateRange[1]) {
                    const endDate = new Date(filters.dateRange[1]);
                    if (nodeDate > endDate) matchesDate = false;
                }
            }

            return matchesKeyword && matchesSentiment && matchesPlatform && matchesTopic && matchesFollowers && matchesDate;
        });

        // Sorting logic
        filteredNodes = [...filteredNodes].sort((a, b) => {
            if (filters.sortBy === 'Followers') {
                return (b.followers || 0) - (a.followers || 0);
            } else if (filters.sortBy === 'Betweenness Centrality') {
                return b.influence - a.influence;
            } else if (filters.sortBy === 'Retweets') {
                // Assuming weight could represent engagement or we had a specific field
                return (b.influence * 0.8) - (a.influence * 0.8); // Placeholder for engagement
            } else if (filters.sortBy === 'Date') {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            }
            return 0;
        });

        // Simple edge filtering: only keep edges where both nodes exist in the filtered list
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredEdges = rawData.edges.filter(edge =>
            nodeIds.has(edge.source) && nodeIds.has(edge.target)
        );

        return {
            ...rawData,
            nodes: filteredNodes,
            edges: filteredEdges,
        };
    }, [rawData, filters]);

    const updateFilters = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const resetFilters = useCallback(() => {
        setFilters({
            keyword: '',
            sentiment: ['Pos', 'Neu', 'Neg'],
            platform: 'All Platforms',
            topic: 'All Topics',
            minFollowers: 0,
            sortBy: 'Betweenness Centrality',
            dateRange: ['', ''],
        });
    }, []);

    return {
        rawData,
        filteredData,
        isLoading,
        error,
        filters,
        processFile,
        updateFilters,
        resetFilters,
        setRawData
    };
};

import { useState, useCallback, useMemo } from 'react';
import { SocialData } from '../utils/csvParser';
import { apiService } from '../services/api';

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
    const [datasetId, setDatasetId] = useState<number | null>(null);
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
            const mappedData = await apiService.uploadCSV(file);
            setRawData(mappedData);
            if (mappedData.datasetId) {
                setDatasetId(mappedData.datasetId);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to process CSV file.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadDemo = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const mappedData = await apiService.loadDemoData();
            setRawData(mappedData);
            if (mappedData.datasetId) {
                setDatasetId(mappedData.datasetId);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load demo data.');
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
                    startDate.setHours(0, 0, 0, 0);
                    if (nodeDate < startDate) matchesDate = false;
                }
                if (filters.dateRange[1]) {
                    const endDate = new Date(filters.dateRange[1]);
                    endDate.setHours(23, 59, 59, 999);
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
                return (b.influence * 0.8) - (a.influence * 0.8);
            } else if (filters.sortBy === 'Date') {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            }
            return 0;
        });

        const nodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredEdges = rawData.edges.filter(edge =>
            nodeIds.has(edge.source) && nodeIds.has(edge.target)
        );

        const sentimentDistribution = filteredNodes.reduce((acc, node) => {
            acc[node.sentiment as keyof typeof acc]++;
            return acc;
        }, { Pos: 0, Neu: 0, Neg: 0 });

        const topInfluencers = [...filteredNodes]
            .sort((a, b) => b.influence - a.influence)
            .slice(0, 5);

        return {
            ...rawData,
            nodes: filteredNodes,
            edges: filteredEdges,
            summary: {
                totalPosts: filteredNodes.length,
                sentimentDistribution,
                topInfluencers,
            },
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

    const goToLandingPage = useCallback(() => {
        setRawData(null);
        setDatasetId(null);
        setError(null);
        setIsLoading(false);
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
        datasetId,
        filteredData,
        isLoading,
        error,
        filters,
        processFile,
        loadDemo,
        updateFilters,
        resetFilters,
        goToLandingPage,
        setRawData
    };
};

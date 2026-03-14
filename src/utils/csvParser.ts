import Papa from 'papaparse';

export interface SocialNode {
    id: string;
    label: string;
    sentiment: 'Pos' | 'Neu' | 'Neg';
    influence: number; // Betweenness Centrality or similar
    followers?: number;
    avgSentiment?: number;
    date?: string; // ISO format or similar
    platform?: string;
    topic?: string;
}

export interface SocialEdge {
    source: string;
    target: string;
    weight: number;
}

export interface SocialData {
    nodes: SocialNode[];
    edges: SocialEdge[];
    summary: {
        totalPosts: number;
        sentimentDistribution: { Pos: number; Neu: number; Neg: number };
        topInfluencers: SocialNode[];
    };
}

export const parseNodeXLData = (csvString: string): Promise<SocialData> => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const data = results.data as any[];

                    // Note: In a real NodeXL CSV, we'd look for specific columns like 'Vertex 1', 'Vertex 2', 'Sentiment', etc.
                    // For this prototype, we'll implement a robust extraction logic that handles common patterns.

                    const nodesMap = new Map<string, SocialNode>();
                    const edges: SocialEdge[] = [];

                    let posCount = 0;
                    let neuCount = 0;
                    let negCount = 0;

                    data.forEach((row) => {
                        const v1 = row['Vertex 1'] || row['source'] || row['User'];
                        const v2 = row['Vertex 2'] || row['target'] || row['Mentioned'];
                        const sentimentVal = row['Sentiment'] || row['Sentiment Score'] || 0;
                        const influenceVal = row['Betweenness Centrality'] || row['Influence'] || Math.random() * 100;

                        if (v1) {
                            if (!nodesMap.has(v1)) {
                                const sentiment = getSentimentCategory(sentimentVal);
                                if (sentiment === 'Pos') posCount++;
                                else if (sentiment === 'Neu') neuCount++;
                                else negCount++;

                                nodesMap.set(v1, {
                                    id: v1,
                                    label: v1,
                                    sentiment,
                                    influence: parseFloat(influenceVal) || 0,
                                    date: row['Date'] || row['Tweet Date'] || row['Time'] || row['Published'] || '',
                                    platform: row['Platform'] || row['Device'] || row['Source'] || 'Web',
                                    topic: row['Topic'] || 'Uncategorized',
                                });
                            }
                        }

                        if (v1 && v2) {
                            edges.push({
                                source: v1,
                                target: v2,
                                weight: 1,
                            });
                        }
                    });

                    const nodes = Array.from(nodesMap.values());
                    const topInfluencers = [...nodes]
                        .sort((a, b) => b.influence - a.influence)
                        .slice(0, 5);

                    resolve({
                        nodes,
                        edges,
                        summary: {
                            totalPosts: data.length,
                            sentimentDistribution: { Pos: posCount, Neu: neuCount, Neg: negCount },
                            topInfluencers,
                        },
                    });
                } catch (error) {
                    reject(error);
                }
            },
            error: (error: any) => reject(error),
        });
    });
};

const getSentimentCategory = (val: string | number): 'Pos' | 'Neu' | 'Neg' => {
    const num = parseFloat(val.toString());
    if (isNaN(num)) {
        const s = val.toString().toLowerCase();
        if (s.includes('pos') || s.includes('good')) return 'Pos';
        if (s.includes('neg') || s.includes('bad')) return 'Neg';
        return 'Neu';
    }
    if (num > 0.1) return 'Pos';
    if (num < -0.1) return 'Neg';
    return 'Neu';
};

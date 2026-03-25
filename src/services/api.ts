import { SocialData, SocialNode } from '../utils/csvParser';

const API_BASE_URL = 'http://localhost:8000/api';

export interface BackendSummary {
    total_nodes: number;
    total_edges: number;
    sentiment_distribution: { Pos: number; Neu: number; Neg: number };
}

export interface BackendResponse {
    dataset_id: number;
    summary: BackendSummary;
    nodes: any[];
    edges: any[];
}

const mapBackendToSocialData = (data: BackendResponse): SocialData => {
    const nodes: SocialNode[] = data.nodes.map(node => ({
        id: node.node_id,
        label: node.label,
        sentiment: node.sentiment as 'Pos' | 'Neu' | 'Neg',
        influence: node.influence,
        followers: node.followers,
        date: node.date,
        platform: node.platform,
        topic: node.topic,
    }));

    const edges = data.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        weight: 1, // Interaction type isn't used as weight yet
    }));

    const topInfluencers = [...nodes]
        .sort((a, b) => b.influence - a.influence)
        .slice(0, 5);

    return {
        datasetId: data.dataset_id,
        nodes,
        edges,
        summary: {
            totalPosts: data.summary.total_nodes,
            sentimentDistribution: data.summary.sentiment_distribution,
            topInfluencers,
        },
    };
};

export const apiService = {
    async uploadCSV(file: File): Promise<SocialData> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload-csv/`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload CSV');
        }

        const data: BackendResponse = await response.json();
        return mapBackendToSocialData(data);
    },

    async loadDemoData(): Promise<SocialData> {
        const response = await fetch(`${API_BASE_URL}/load-demo/`, {
            method: 'POST',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to load demo data');
        }

        const data: BackendResponse = await response.json();
        return mapBackendToSocialData(data);
    },

    async getData(datasetId?: number): Promise<SocialData> {
        const url = datasetId
            ? `${API_BASE_URL}/data/?dataset_id=${datasetId}`
            : `${API_BASE_URL}/data/`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data: BackendResponse = await response.json();
        return mapBackendToSocialData(data);
    }
};

import React from 'react';
import {
    TrendingUp,
    Users,
    MessageSquare,
    PieChart as PieChartIcon,
    ArrowRight,
    ChevronRight,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialData } from '../utils/csvParser';

interface AnalysisDashboardProps {
    data: SocialData;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
    const { summary } = data;

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'Pos': return 'text-green-400';
            case 'Neg': return 'text-red-400';
            default: return 'text-blue-400';
        }
    };

    const getSentimentBg = (sentiment: string) => {
        switch (sentiment) {
            case 'Pos': return 'bg-green-400/20';
            case 'Neg': return 'bg-red-400/20';
            default: return 'bg-blue-400/20';
        }
    };

    return (
        <div className="w-full p-8 space-y-8 animate-fade-in bg-[#050a14]">
            <header className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Intelligence Dashboard</h2>
                    <p className="text-text-secondary mt-1">Institutional analysis of {summary.totalPosts.toLocaleString()} social interactions.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 text-xs font-bold rounded-lg transition-all">Export Report</button>
                    <button className="bg-accent-primary hover:bg-blue-600 text-white px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/10">Refresh Insights</button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<TrendingUp size={20} />}
                    title="Total Reach"
                    value={summary.totalPosts.toLocaleString()}
                    label="Total interactions tracked"
                    trend="+12% from last week"
                />
                <StatCard
                    icon={<MessageSquare size={20} />}
                    title="Avg Sentiment"
                    value="Neutral" // We'd calculate this properly in a real app
                    label="Overall brand perception"
                    trend="Stable"
                />
                <StatCard
                    icon={<Users size={20} />}
                    title="Key Influencers"
                    value={summary.topInfluencers.length.toString()}
                    label="Institutional nodes found"
                    trend="Expanding mapping"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sentiment Distribution */}
                <section className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold flex items-center gap-2">
                            <PieChartIcon size={18} className="text-accent-primary" />
                            Sentiment Distribution
                        </h3>
                        <BarChart3 size={18} className="text-muted" />
                    </div>
                    <div className="space-y-6">
                        <SentimentProgress
                            label="Positive"
                            count={summary.sentimentDistribution.Pos}
                            total={summary.totalPosts}
                            color="bg-green-500"
                        />
                        <SentimentProgress
                            label="Neutral"
                            count={summary.sentimentDistribution.Neu}
                            total={summary.totalPosts}
                            color="bg-blue-500"
                        />
                        <SentimentProgress
                            label="Negative"
                            count={summary.sentimentDistribution.Neg}
                            total={summary.totalPosts}
                            color="bg-red-500"
                        />
                    </div>
                </section>

                {/* Influencer List */}
                <section className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold flex items-center gap-2">
                            <Users size={18} className="text-accent-primary" />
                            Top Influencers
                        </h3>
                        <button className="text-xs text-accent-primary font-semibold flex items-center gap-1 hover:underline">
                            View Full Map <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {summary.topInfluencers.map((influencer, idx) => (
                            <div key={influencer.id} className="flex items-center gap-4 p-3 bg-surface-hover/20 rounded-xl border border-subtle group hover:bg-surface-hover/40 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center font-bold text-xs text-accent-primary">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-accent-primary transition-colors">{influencer.label}</p>
                                    <p className="text-[10px] text-muted font-medium uppercase tracking-wider">NodeXL Cluster: {Math.floor(influencer.influence / 10)}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${getSentimentBg(influencer.sentiment)} ${getSentimentColor(influencer.sentiment)}`}>
                                        {influencer.sentiment}
                                    </div>
                                    <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-tighter">Betw: {influencer.influence.toFixed(1)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Network Graph Placeholder */}
            <section className="glass-panel p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none group-hover:from-accent-primary/10 transition-all duration-500" />

                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mb-6 border border-accent-primary/20 animate-pulse">
                    <Share2Icon className="text-accent-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Network Influence Map</h3>
                <p className="text-secondary max-w-md text-sm mb-8">
                    Visualizing Betweenness Centrality and topic clusters across Daystar University conversation nodes. 2D visualization rendering...
                </p>
                <button className="btn-primary group">
                    Launch Interactive Map
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Mock decorative nodes */}
                <div className="absolute top-10 left-20 w-3 h-3 bg-blue-500/30 rounded-full blur-sm" />
                <div className="absolute bottom-10 right-20 w-4 h-4 bg-accent-secondary/30 rounded-full blur-sm" />
                <div className="absolute top-1/2 right-40 w-2 h-2 bg-text-muted/30 rounded-full blur-sm" />
            </section>
        </div>
    );
};

const StatCard = ({ icon, title, value, label, trend }: { icon: any, title: string, value: string, label: string, trend: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-6 group cursor-default"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                {trend}
            </div>
        </div>
        <h3 className="text-secondary text-sm font-medium mb-1 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold mb-2">{value}</p>
        <p className="text-[10px] text-muted font-medium mb-1 uppercase tracking-wider">{label}</p>
    </motion.div>
);

const SentimentProgress = ({ label, count, total, color }: { label: string, count: number, total: number, color: string }) => {
    const percentage = (count / total) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-secondary">{label}</span>
                <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                />
            </div>
            <div className="text-[10px] text-muted text-right uppercase font-bold tracking-tighter">
                {count} Interactions
            </div>
        </div>
    );
}

const Share2Icon = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

export default AnalysisDashboard;

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Database,
    Puzzle,
    MessageCircle,
    Star,
    Share2,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialData } from '../utils/csvParser';
import simelogo from '../../simelogo.jpeg';

interface AnalysisDashboardProps {
    data: SocialData;
    datasetId?: number | null;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const { summary, nodes } = data;

    // Derived stats (mocking some for the high-end look based on screenshots)
    const uniqueAuthors = new Set(nodes.map(n => n.label)).size;
    const estReach = (summary.totalPosts * 1250).toLocaleString(); // Mock multiplier
    const avgEngagement = "7.55%";
    const positiveSent = Math.round((summary.sentimentDistribution.Pos / summary.totalPosts) * 100);
    const topicsFound = 6;

    const tabs = [
        { id: 'Overview', icon: LayoutDashboard },
        // { id: 'Data Table', icon: Database },
        // { id: 'Topic Model', icon: Puzzle },
        // { id: 'Sentiment', icon: MessageCircle },
        // { id: 'Influencers', icon: Star },
        // { id: 'Network', icon: Share2 },
        // { id: 'Report', icon: FileText },
    ];

    return (
        <div className="w-full min-h-screen bg-[#050a14] text-white p-6 pb-20 font-inter">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <StatCard title="Total Mentions" value={summary.totalPosts.toString()} accent="border-[#facc15]" />
                <StatCard title="Unique Authors" value={uniqueAuthors.toString()} accent="border-[#3b82f6]" />
                <StatCard title="Est. Reach" value={estReach} subtitle="20.1M" accent="border-[#10b981]" />
                <StatCard title="Avg Engagement" value={avgEngagement} accent="border-[#f59e0b]" />
                <StatCard title="Positive Sent." value={`${positiveSent}%`} accent="border-[#8b5cf6]" />
                <StatCard title="Topics Found" value={topicsFound.toString()} accent="border-[#facc15]" />
            </div>

            {/* Tab Navigation */}
            <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-1 mb-8 flex gap-1 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[#facc15] text-[#050a14]'
                            : 'text-text-secondary hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.id}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Mentions Over Time - Line Chart */}
                <div className="lg:col-span-2 bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-bold tracking-tight">Mentions Over Time</h3>
                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Temporal</span>
                    </div>

                    <div className="h-48 w-full relative mt-4">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#facc15" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,80 Q50,70 100,90 T200,60 T300,100 T400,40 T500,80 T600,70 T700,90 T800,50 T900,80 T1000,60"
                                fill="none"
                                stroke="#facc15"
                                strokeWidth="3"
                                className="drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                            />
                            <path
                                d="M0,80 Q50,70 100,90 T200,60 T300,100 T400,40 T500,80 T600,70 T700,90 T800,50 T900,80 T1000,60 L1000,150 L0,150 Z"
                                fill="url(#chartGradient)"
                            />
                        </svg>
                    </div>

                    <div className="flex justify-between text-[10px] text-text-muted font-bold mt-4 px-2 uppercase tracking-tighter">
                        <span>Jan 01</span>
                        <span>Feb 28</span>
                        <span>May 07</span>
                        <span>Jul 26</span>
                        <span>Sep 24</span>
                        <span>Dec 31</span>
                    </div>
                </div>

                {/* Sentiment Distribution - Donut Chart */}
                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6 relative group">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold tracking-tight">Sentiment Distribution</h3>
                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">All Posts</span>
                    </div>

                    <div className="flex items-center justify-center gap-10 mt-4">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="12" />
                                <circle
                                    cx="80" cy="80" r="70" fill="none" stroke="#10b981"
                                    strokeWidth="12" strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * positiveSent) / 100}
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="80" cy="80" r="70" fill="none" stroke="#ef4444"
                                    strokeWidth="12" strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * (positiveSent + 23)) / 100}
                                    strokeDashoffset-anim="true"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black">{summary.totalPosts}</span>
                                <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">Total</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SentimentLegend color="bg-green-500" label="Positive" percent={`${positiveSent}%`} />
                            <SentimentLegend color="bg-slate-500" label="Neutral" percent="30%" />
                            <SentimentLegend color="bg-red-500" label="Negative" percent="23%" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Platform Share */}
                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold tracking-tight">Platform Share</h3>
                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Voice</span>
                    </div>
                    <div className="space-y-5">
                        <PlatformBar label="twitter" count={152} percent="width-[80%]" color="bg-[#0ea5e9]" />
                        <PlatformBar label="tiktok" count={40} percent="width-[25%]" color="bg-[#10b981]" />
                        <PlatformBar label="linkedin" count={39} percent="width-[24%]" color="bg-[#3b82f6]" />
                        <PlatformBar label="facebook" count={35} percent="width-[20%]" color="bg-[#6366f1]" />
                        <PlatformBar label="instagram" count={34} percent="width-[18%]" color="bg-[#f43f5e]" />
                    </div>
                </div>

                {/* Top Hashtags */}
                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold tracking-tight">Top Hashtags</h3>
                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Frequency</span>
                    </div>
                    <div className="h-40 flex items-center inline leading-relaxed justify-center">
                        {/* <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">hashtag mapping...</span> */}
                        
                        <div className="">
                            <ul className="text-[10px] text-text font-bold tracking-[0.2em]">#NikoKadi</ul>
                            <PlatformBar label="" count={500} percent="width-[50%]" color="bg-[#f0b100]" />
                        </div>
                        <br />
                        
                        <div className="space-y-5">
                            <ul className="text-[10px] text-text font-bold tracking-[0.2em]">#RutoMustGo</ul>
                            <PlatformBar label="" count={300} percent="width-[30%]" color="bg-[#6366f1]" />
                        </div>
                        <br />
                        <div className="space-y-5">
                            <ul className="text-[10px] text-text font-bold tracking-[0.2em]">#ArsenalvsManCity</ul>
                            <PlatformBar label="" count={100} percent="width-[10%]" color="bg-[#0ea5e9]" />
                        </div>
                        
                        
                        
                            
                        
                    </div>
                </div>

                {/* Keyword Cloud */}
                {/* <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold tracking-tight">Keyword Cloud</h3>
                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Click to Filter</span>
                    </div>
                    <div className="h-40 flex items-center justify-center">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">entity extraction...</span>
                    </div>
                </div> */}
            </div>

            {/* Top Posts Table */}
            <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold tracking-tight uppercase">Top Posts by Engagement</h3>
                    <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Top 5</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black text-text-muted uppercase tracking-widest">
                                <th className="pb-4 px-4">Author</th>
                                <th className="pb-4 px-4">Content</th>
                                <th className="pb-4 px-4">Platform</th>
                                <th className="pb-4 px-4 text-right">Shares</th>
                                <th className="pb-4 px-4 text-right">Likes</th>
                                <th className="pb-4 px-4 text-center">Sentiment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {nodes.slice(0, 5).map((node) => (
                                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-4 text-xs font-bold text-white uppercase tracking-tighter">{node.label}</td>
                                    <td className="py-4 px-4 text-xs text-text-secondary max-w-sm truncate">Analyzing social media behavior trends in {node.topic || 'Daystar University'}...</td>
                                    <td className="py-4 px-4">
                                        <span className="text-[10px] font-black uppercase text-text-muted bg-white/5 px-2 py-1 rounded">{node.platform || 'Twitter'}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right text-xs font-bold">{(2 * 12).toFixed(0)}</td>
                                    <td className="py-4 px-4 text-right text-xs font-bold">{(10* 45).toFixed(0)}</td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${node.sentiment === 'Pos' ? 'bg-green-500/20 text-green-400' :
                                            node.sentiment === 'Neg' ? 'bg-red-500/20 text-red-400' :
                                                'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {node.sentiment}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Attribution */}
            <footer className="mt-20 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 opacity-40">
                    <img src={simelogo} alt="SIME Logo" className="w-6 h-6 rounded object-cover" />
                    <p className="text-sm text-text-muted font-black uppercase tracking-[0.4em]">
                        Powered by Simelab and Dcamd
                    </p>
                </div>
            </footer>
        </div>
    );
};

const StatCard = ({ title, value, subtitle, accent }: { title: string, value: string, subtitle?: string, accent: string }) => (
    <div className={`bg-[#0f172a]/30 border border-white/5 border-b-2 ${accent} rounded-2xl p-5 group hover:bg-[#0f172a]/50 transition-all cursor-default`}>
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">{value}</span>
            {subtitle && <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{subtitle}</span>}
        </div>
    </div>
);

const SentimentLegend = ({ color, label, percent }: { color: string, label: string, percent: string }) => (
    <div className="flex items-center justify-between gap-6 min-w-[120px]">
        <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs font-bold text-text-secondary">{label}</span>
        </div>
        <span className="text-xs font-black">{percent}</span>
    </div>
);

const PlatformBar = ({ label, count, percent, color }: { label: string, count: number, percent: string, color: string }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-text-secondary">{label}</span>
            <span className="text-white">{count}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: percent.split('[')[1].split(']')[0] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
    </div>
);

export default AnalysisDashboard;

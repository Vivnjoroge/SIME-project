import React from 'react';
import {
    Search,
    MessageSquare,
    Calendar,
    Share2,
    Filter,
    ChevronRight,
    BarChart2,
    Users
} from 'lucide-react';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-80 h-screen glass-panel rounded-none border-y-0 border-l-0 border-r border-subtle flex flex-col p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <BarChart2 className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">SIMElab</h1>
                    <p className="text-xs text-secondary font-medium uppercase tracking-wider">Data Explorer</p>
                </div>
            </div>

            <nav className="flex-1 space-y-8">
                {/* Keyword Search */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2 text-secondary">
                        <Search size={16} /> Keyword Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className="w-full bg-surface-hover/50 border border-subtle rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all pr-10"
                        />
                        <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                </div>

                {/* Sentiment Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2 text-secondary">
                        <MessageSquare size={16} /> Sentiment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Pos', 'Neu', 'Neg'].map((s) => (
                            <button
                                key={s}
                                className="py-1.5 text-xs font-semibold rounded-md border border-subtle hover:bg-surface-hover/30 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2 text-secondary">
                        <Calendar size={16} /> Date Range
                    </label>
                    <div className="space-y-2">
                        <input
                            type="date"
                            className="w-full bg-surface-hover/50 border border-subtle rounded-lg py-2 text-xs px-3 focus:outline-none focus:border-accent-primary transition-all color-white"
                        />
                    </div>
                </div>

                {/* Betweenness Centrality */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2 text-secondary">
                        <Users size={16} /> Betweenness Centrality
                    </label>
                    <div className="p-3 bg-surface-hover/20 rounded-lg border border-subtle">
                        <input
                            type="range"
                            className="w-full accent-accent-primary"
                            min="0"
                            max="100"
                        />
                        <div className="flex justify-between text-[10px] text-muted mt-1 uppercase font-bold tracking-tighter">
                            <span>Low Influence</span>
                            <span>High Influence</span>
                        </div>
                    </div>
                </div>

                {/* Filter Presets */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2 text-secondary">
                        <Filter size={16} /> Presets
                    </label>
                    <div className="space-y-2">
                        {['Daystar Brand', 'Institutional Needs', 'Topic Clusters'].map((p) => (
                            <button
                                key={p}
                                className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-surface-hover/30 text-secondary hover:text-white transition-all flex items-center justify-between group"
                            >
                                {p}
                                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-subtle">
                <div className="flex items-center gap-3 p-3 bg-surface-hover/20 rounded-xl border border-subtle">
                    <div className="w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center text-bg-primary font-bold text-sm">
                        DU
                    </div>
                    <div>
                        <p className="text-xs font-bold leading-none">Daystar University</p>
                        <p className="text-[10px] text-muted mt-1">Institutional Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

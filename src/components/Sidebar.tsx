import React from 'react';
import { FilterState } from '../hooks/useSocialData';
import {
    Calendar,
    ChevronRight,
    Download,
    AlertTriangle,
    Flame,
    Megaphone,
    Monitor,
    Globe,
    RotateCcw,
    Upload,
    CheckCircle2
} from 'lucide-react';

interface SidebarProps {
    filters: FilterState;
    onFilterChange: (newFilters: Partial<FilterState>) => void;
    onResetFilters: () => void;
    isDataLoaded: boolean;
    onFileProcessed: (file: File) => void;
    datasetId: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, onResetFilters, isDataLoaded, onFileProcessed, datasetId }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [activeQuickView, setActiveQuickView] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const dateFromRef = React.useRef<HTMLInputElement>(null);
    const dateToRef = React.useRef<HTMLInputElement>(null);

    const handleQuickViewClick = (viewName: string) => {
        setActiveQuickView(viewName);
        switch (viewName) {
            case 'Top Influencers':
                onFilterChange({
                    sortBy: 'Betweenness Centrality',
                    minFollowers: 0,
                    sentiment: ['Pos', 'Neu', 'Neg'],
                    topic: 'All Topics'
                });
                break;
            case 'Negative Mentions':
                onFilterChange({
                    sentiment: ['Neg'],
                    sortBy: 'Betweenness Centrality'
                });
                break;
            case 'Viral Posts':
                onFilterChange({
                    sortBy: 'Retweets',
                    sentiment: ['Pos', 'Neu', 'Neg'],
                    topic: 'All Topics'
                });
                break;
            case 'Complaints / Issues':
                onFilterChange({
                    keyword: 'issue',
                    sentiment: ['Neg'],
                    sortBy: 'Betweenness Centrality'
                });
                break;
            case 'High-Reach Accounts':
                onFilterChange({
                    minFollowers: 1000,
                    sortBy: 'Followers'
                });
                break;
            default:
                break;
        }
    };

    const handleResetAll = () => {
        setActiveQuickView(null);
        onResetFilters();
    };

    const handleManualFilterChange = (newFilters: Partial<FilterState>) => {
        setActiveQuickView(null);
        onFilterChange(newFilters);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
            onFileProcessed(droppedFile);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileProcessed(selectedFile);
        }
    };
    return (
        <aside className="w-[300px] h-[calc(100vh-64px)] bg-[#050a14] border-r border-white/5 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-6">
                {!isDataLoaded && (
                    <div className="space-y-6">
                        {/* UPLOAD SECTION (Screenshot 1) */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Upload NodeXL CSV</span>
                                <div className="h-[1px] flex-1 bg-white/5" />
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".csv,.xlsx"
                            />

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${isDragging
                                    ? 'border-accent-secondary bg-accent-secondary/10 scale-[1.02]'
                                    : 'border-accent-secondary/30 bg-accent-secondary/5 hover:border-accent-secondary/50 hover:bg-accent-secondary/8'
                                    }`}
                            >
                                <div className="w-10 h-10 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                                    <Upload className="text-accent-secondary" size={20} />
                                </div>
                                <span className="text-sm font-bold text-white">Drop CSV Here</span>
                                <p className="text-[10px] text-text-muted text-center leading-relaxed">
                                    NodeXL export · any platform<br />
                                    Drag & drop or click to browse
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 space-y-3 border border-white/5">
                                <div className="flex flex-col gap-1.5 px-1">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={12} className="text-accent-secondary mt-0.5" />
                                        <p className="text-[10px] text-text-secondary">Auto-detects NodeXL columns:</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1 pl-5">
                                        {['Tweet / Text', 'Screen Name', 'Followers', 'Centrality', 'PageRank'].map(col => (
                                            <span key={col} className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] text-text-muted font-bold uppercase transition-colors hover:text-white">
                                                {col}
                                            </span>
                                        ))}
                                        <span className="px-1.5 py-0.5 rounded text-[8px] text-text-muted font-bold uppercase italic text-white/40">+7 others</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 size={12} className="text-accent-secondary mt-0.5" />
                                    <p className="text-[10px] text-text-secondary">Handles quoted commas in tweets</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 size={12} className="text-accent-secondary mt-0.5" />
                                    <p className="text-[10px] text-text-secondary">Works with all platform exports</p>
                                </div>
                            </div>
                        </div>

                        {/* REPORT INFO (Screenshot 1) */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Report Info</span>
                                <div className="h-[1px] flex-1 bg-white/5" />
                            </div>
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase px-1">Organisation Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Daystar University"
                                        className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none focus:border-accent-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase px-1">Report Period</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Jan-Dec 2026"
                                        className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none focus:border-accent-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FILTERS SECTION (Unified from sidebarscreenshot.png) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Filters</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    {/* KEYWORD */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Keyword / @User / #Tag</label>
                        <input
                            type="text"
                            value={filters.keyword}
                            onChange={(e) => handleManualFilterChange({ keyword: e.target.value })}
                            placeholder="Search mentions..."
                            className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none focus:border-accent-primary transition-colors"
                        />
                    </div>

                    {/* PLATFORM */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Platform</label>
                        <div className="relative">
                            <select
                                value={filters.platform}
                                onChange={(e) => handleManualFilterChange({ platform: e.target.value })}
                                className="w-full bg-[#0a1120] border border-accent-secondary rounded-lg py-3 px-3 text-sm text-white focus:outline-none appearance-none"
                            >
                                <option>All Platforms</option>
                                <option>Twitter</option>
                                <option>Facebook</option>
                                <option>Instagram</option>
                                <option>LinkedIn</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <ChevronRight className="rotate-90" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* SENTIMENT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Sentiment</label>
                        <div className="relative">
                            <select
                                value={filters.sentiment.length === 3 ? 'All' : filters.sentiment[0]}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleManualFilterChange({
                                        sentiment: val === 'All' ? ['Pos', 'Neu', 'Neg'] : [val as any]
                                    });
                                }}
                                className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none appearance-none"
                            >
                                <option value="All">All Sentiments</option>
                                <option value="Pos">Positive</option>
                                <option value="Neu">Neutral</option>
                                <option value="Neg">Negative</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <ChevronRight className="rotate-90" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* TOPIC */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Topic</label>
                        <div className="relative">
                            <select
                                value={filters.topic}
                                onChange={(e) => handleManualFilterChange({ topic: e.target.value })}
                                className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none appearance-none"
                            >
                                <option>All Topics</option>
                                <option>Institutional</option>
                                <option>Academic</option>
                                <option>Social Life</option>
                                <option>Infrastructure</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <ChevronRight className="rotate-90" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* MIN FOLLOWERS */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Min Followers</label>
                        <input
                            type="number"
                            value={filters.minFollowers}
                            onChange={(e) => handleManualFilterChange({ minFollowers: parseInt(e.target.value) || 0 })}
                            placeholder="e.g. 1000"
                            className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none focus:border-accent-primary"
                        />
                    </div>

                    {/* DATE FILTERS */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Date From</label>
                        <div className="relative group">
                            <input
                                type="date"
                                ref={dateFromRef}
                                value={filters.dateRange[0]}
                                onChange={(e) => handleManualFilterChange({ dateRange: [e.target.value, filters.dateRange[1]] })}
                                className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-text-secondary focus:outline-none focus:border-accent-secondary transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            <Calendar
                                onClick={() => {
                                    try {
                                        dateFromRef.current?.showPicker();
                                    } catch (e) {
                                        dateFromRef.current?.focus();
                                    }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent-secondary cursor-pointer transition-colors"
                                size={16}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Date To</label>
                        <div className="relative group">
                            <input
                                type="date"
                                ref={dateToRef}
                                value={filters.dateRange[1]}
                                onChange={(e) => handleManualFilterChange({ dateRange: [filters.dateRange[0], e.target.value] })}
                                className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-text-secondary focus:outline-none focus:border-accent-secondary transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            <Calendar
                                onClick={() => {
                                    try {
                                        dateToRef.current?.showPicker();
                                    } catch (e) {
                                        dateToRef.current?.focus();
                                    }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent-secondary cursor-pointer transition-colors"
                                size={16}
                            />
                        </div>
                    </div>

                    {/* SORT BY */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase px-1">Sort By</label>
                        <div className="relative">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleManualFilterChange({ sortBy: e.target.value })}
                                className="w-full bg-[#0a1120] border border-white/10 rounded-lg py-3 px-3 text-sm text-white focus:outline-none appearance-none"
                            >
                                <option>Betweenness Centrality</option>
                                <option>Followers</option>
                                <option>Retweets</option>
                                <option>Date</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <ChevronRight className="rotate-90" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* RESET ALL FILTERS BUTTON */}
                    <button
                        onClick={handleResetAll}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#111a2e] border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                    >
                        <RotateCcw size={14} className="stroke-[2.5]" />
                        Reset All Filters
                    </button>
                </div>

                {/* QUICK VIEWS */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Quick Views</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    <div className="space-y-1">
                        {[
                            // { name: 'Top Influencers', icon: <Globe size={14} /> },
                            // { name: 'Negative Mentions', icon: <AlertTriangle size={14} /> },
                            { name: 'Viral Posts', icon: <Flame size={14} /> },
                            // { name: 'Complaints / Issues', icon: <Megaphone size={14} /> },
                            // { name: 'High-Reach Accounts', icon: <Monitor size={14} /> },
                        ].map((view) => (
                            <button
                                key={view.name}
                                onClick={() => handleQuickViewClick(view.name)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-all group ${activeQuickView === view.name
                                    ? 'bg-accent-secondary/10 border-accent-secondary text-accent-secondary shadow-lg shadow-accent-secondary/5'
                                    : 'bg-accent-primary/5 border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 hover:border-accent-primary/40'
                                    }`}
                            >
                                <div className="transition-colors">
                                    {view.icon}
                                </div>
                                <span className="text-xs font-medium">{view.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* EXPORT */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Export</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                if (datasetId) window.location.href = `http://localhost:8000/api/export-csv/?dataset_id=${datasetId}`;
                            }}
                            disabled={!datasetId}
                            className="w-full bg-accent-secondary hover:bg-yellow-500 text-bg-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-xs transition-all active:scale-95 shadow-lg shadow-yellow-500/5 disabled:opacity-50"
                        >
                            <Download size={14} className="stroke-[3]" />
                            Export Filtered CSV
                        </button>
                        <button
                            onClick={() => {
                                if (datasetId) window.location.href = `http://localhost:8000/api/export-json/?dataset_id=${datasetId}`;
                            }}
                            disabled={!datasetId}
                            className="w-full bg-accent-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-xs transition-all active:scale-95 shadow-lg shadow-blue-500/5 disabled:opacity-50"
                        >
                            <Download size={14} />
                            Export JSON
                        </button>
                    </div>
                </div>
            </div>
        </aside >
    );
};

export default Sidebar;

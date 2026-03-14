import React from 'react';
import { Download } from 'lucide-react';

const TopBar: React.FC = () => {
    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-bg-primary/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent-secondary rounded flex items-center justify-center font-bold text-bg-primary text-xl">
                    SL
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white leading-tight">SIMELab Data Explorer</h1>
                    <p className="text-[10px] text-text-muted font-medium opacity-70">Social Intelligence Platform v4.0</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
                </div>
                <button className="bg-accent-secondary hover:bg-yellow-500 text-bg-primary font-bold py-2 px-5 rounded-lg flex items-center gap-2 text-xs transition-all active:scale-95 shadow-lg shadow-yellow-500/10">
                    <Download size={14} className="stroke-[3]" />
                    Export Report
                </button>
            </div>
        </header>
    );
};

export default TopBar;

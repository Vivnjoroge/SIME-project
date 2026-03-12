import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

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
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-bg-primary/50">
            <div className="max-w-2xl w-full text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    Uncover Institutional Intelligence
                </h2>
                <p className="text-secondary text-lg">
                    Transform raw NodeXL data into actionable sentiment, topic, and influencer insights.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`w-full max-w-xl aspect-video glass-panel border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300 ${isDragging ? 'border-accent-primary bg-accent-primary/5 scale-[1.02]' : 'border-subtle hover:border-text-muted'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Upload className="text-accent-primary" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Drop CSV Here</h3>
                            <p className="text-muted text-sm mb-6">or click to browse from your computer</p>
                            <button className="btn-primary text-sm">
                                Choose File
                            </button>
                            <p className="text-[10px] text-muted mt-6 uppercase tracking-widest font-bold">
                                Supported format: NodeXL CSV | Excel
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="w-full p-4 bg-surface-hover/30 rounded-xl border border-subtle flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-[10px] text-muted">{(file.size / 1024).toFixed(2)} KB • Ready for analysis</p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="btn-primary">
                                    <CheckCircle2 size={18} />
                                    Start Analysis
                                </button>
                                <button className="btn-outline">
                                    Back
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-4xl opacity-50">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 text-accent-primary">
                        <MessageSquare size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1">Sentiment Tracking</p>
                    <p className="text-[10px] text-muted">Automated polarity detection</p>
                </div>
                <div className="flex flex-col items-center text-center border-x border-subtle px-8">
                    <div className="mb-3 text-accent-primary">
                        <Upload size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1">Topic Modeling</p>
                    <p className="text-[10px] text-muted">Identify key conversation clusters</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 text-accent-primary">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1">Influencer Mapping</p>
                    <p className="text-[10px] text-muted">Centrality & prestige analysis</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

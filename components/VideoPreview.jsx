'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Music, Video, CheckCircle, AlertCircle } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';

const VideoPreview = ({ videoData, onDownload }) => {
    const [selectedQuality, setSelectedQuality] = useState('720p');
    const [isAudioOnly, setIsAudioOnly] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, downloading, success, error
    const [progress, setProgress] = useState(0);

    const handleDownload = async () => {
        setDownloadStatus('downloading');
        setProgress(0);

        try {
            await onDownload({
                url: videoData.url,
                quality: selectedQuality,
                isAudioOnly,
                onProgress: (p) => setProgress(p)
            });
            setDownloadStatus('success');
            setTimeout(() => setDownloadStatus('idle'), 3000);
        } catch (error) {
            setDownloadStatus('error');
            setTimeout(() => setDownloadStatus('idle'), 3000);
        }
    };

    if (!videoData) return null;

    return (
        <GlassCard className="w-full max-w-4xl mx-auto mt-4 md:mt-12 overflow-hidden hover:shadow-[0_0_30px_rgba(188,19,254,0.15)] transition-all duration-500 border-glass-highlight rounded-2xl md:rounded-3xl">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 relative z-10">
                {/* Thumbnail Section */}
                <div className="relative w-full md:w-1/2 aspect-video rounded-xl overflow-hidden group border border-white/10 shadow-2xl shrink-0">
                    <img
                        src={videoData.thumbnail}
                        alt={videoData.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-md text-xs font-mono text-neon-blue border border-neon-blue/20 backdrop-blur-md shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                        {videoData.duration}
                    </div>
                </div>

                {/* Info & Options Section */}
                <div className="flex-1 flex flex-col justify-between py-2 px-1 md:px-0">
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-white mb-2 leading-tight line-clamp-2">
                            {videoData.title}
                        </h2>
                        <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-purple"></span>
                            {videoData.author}
                        </p>

                        {/* Format Selection */}
                        <div className="space-y-4">
                            <div className="flex bg-black/20 p-1 rounded-xl w-full md:w-fit border border-white/5">
                                <button
                                    onClick={() => setIsAudioOnly(false)}
                                    className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${!isAudioOnly ? 'bg-neon-blue/10 text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.1)] border border-neon-blue/20' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Video size={18} /> Video
                                </button>
                                <button
                                    onClick={() => setIsAudioOnly(true)}
                                    className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${isAudioOnly ? 'bg-neon-purple/10 text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.1)] border border-neon-purple/20' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Music size={18} /> Audio
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {!isAudioOnly && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-4 gap-2"
                                    >
                                        {['High', '720p', '480p', '360p'].map((quality) => (
                                            <button
                                                key={quality}
                                                onClick={() => setSelectedQuality(quality === 'High' ? 'highest' : quality)}
                                                className={`px-2 py-3 md:py-2 rounded-lg text-xs md:text-sm transition-all border ${(selectedQuality === quality || (selectedQuality === 'highest' && quality === 'High'))
                                                    ? 'border-neon-blue bg-neon-blue/5 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                                                    : 'border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300 bg-white/5'
                                                    }`}
                                            >
                                                {quality}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Download Action */}
                    <div className="mt-6 md:mt-8 space-y-4">
                        {downloadStatus === 'downloading' ? (
                            <div className="w-full bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between text-sm mb-2 text-neon-blue font-mono">
                                    <span className="animate-pulse">Downloading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-linear-to-r from-neon-blue via-neon-purple to-neon-pink rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                                    />
                                </div>
                            </div>
                        ) : downloadStatus === 'success' ? (
                            <NeonButton className="w-full bg-neon-green/10 text-neon-green border border-neon-green/30 cursor-default shadow-[0_0_20px_rgba(10,255,0,0.1)] py-4 md:py-3">
                                <CheckCircle size={20} /> Download Complete
                            </NeonButton>
                        ) : downloadStatus === 'error' ? (
                            <NeonButton className="w-full bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(255,0,0,0.1)] py-4 md:py-3" onClick={handleDownload}>
                                <AlertCircle size={20} /> Retry Download
                            </NeonButton>
                        ) : (
                            <NeonButton onClick={handleDownload} className="w-full group relative overflow-hidden py-4 md:py-3" variant="primary">
                                <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                                    <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                                    Download via SaveFrom
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-neon-blue via-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            </NeonButton>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default VideoPreview;

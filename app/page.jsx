'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import AnimatedInput from '@/components/ui/AnimatedInput';
import MobileNav from '@/components/MobileNav';
import VideoPreview from '@/components/VideoPreview';
import InstallPrompt from '@/components/InstallPrompt';

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [videoData, setVideoData] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    const handleInputChange = (e) => {
        setUrl(e.target.value);
        setError('');
    };

    const handleFetchMetadata = async () => {
        if (!url) return;

        // Skip metadata fetch and redirect directly to SaveFrom
        // This avoids YouTube's bot detection entirely
        const externalDownloader = `https://savefrom.net/#url=${encodeURIComponent(url)}`;

        // Open in same window to keep user in the app (embedded browser)
        window.location.href = externalDownloader;

        toast.success('Redirecting to downloader...');
    };

    const handleDownload = async ({ quality, isAudioOnly, onProgress }) => {
        try {
            // Redirect to external downloader instead of downloading through our server
            // This avoids YouTube's bot detection issues

            // Using savefrom.net - it accepts the YouTube URL directly as a parameter
            const externalDownloader = `https://savefrom.net/#url=${encodeURIComponent(url)}`;

            // Open in new tab
            window.open(externalDownloader, '_blank');

            onProgress(100);
            toast.success('Opening external downloader...');

        } catch (err) {
            console.error(err);
            const errorMessage = err.message || 'Failed to open downloader';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen relative p-4 pb-24 md:pb-20 overflow-x-hidden flex flex-col items-center justify-center">
            <ParticleBackground />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-5xl mx-auto text-center"
            >
                {/* Desktop Version Badge */}
                <div className="hidden md:inline-block mb-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-sm font-medium tracking-wide shadow-[0_0_10px_rgba(0,243,255,0.2)] animate-pulse-slow">
                    V 2.0.0 &bull; BETA
                </div>

                {/* Mobile Version Badge - Simplified */}
                <div className="md:hidden mb-4 inline-block px-2 py-0.5 rounded-full border border-neon-blue/20 text-neon-blue text-[10px] font-mono opacity-70">
                    BETA 2.0
                </div>

                {/* App Logo */}
                <div className="mb-4 md:mb-6 flex justify-center">
                    <img
                        src="/logo-app.png"
                        alt="NeonDownloader Logo"
                        className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                    />
                </div>

                <h1 className="text-4xl md:text-8xl font-bold mb-4 md:mb-6 tracking-tighter" data-text="NeonDownloader">
                    <span className="glitch bg-clip-text text-transparent bg-linear-to-r from-neon-blue via-white to-neon-purple drop-shadow-[0_0_25px_rgba(0,243,255,0.4)]" data-text="NeonDownloader">
                        NeonDownloader
                    </span>
                </h1>

                <p className="hidden md:block text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    Experience the future of downloading. <br />
                    <span className="text-gray-200 font-normal">Fast. Secure. Unlimited.</span>
                </p>

                {/* Mobile Subtitle */}
                <p className="md:hidden text-sm text-gray-400 mb-8 max-w-xs mx-auto">
                    Fast & Secure YouTube Downloader
                </p>

                <div className="mb-8 md:mb-16 w-full">
                    <AnimatedInput
                        value={url}
                        onChange={handleInputChange}
                        onSubmit={handleFetchMetadata}
                        placeholder="Paste Link..."
                        error={error}
                    />
                </div>

                {/* ... Loading & Preview Section ... */}
                {loading && (
                    <div className="mt-8 md:mt-12 flex flex-col items-center justify-center gap-4">
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <div className="absolute inset-0 rounded-full border-t-2 border-neon-blue animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-r-2 border-neon-purple animate-spin-slow"></div>
                            <div className="absolute inset-4 rounded-full border-l-2 border-neon-pink animate-spin"></div>
                        </div>
                        <p className="text-neon-blue/80 text-xs md:text-sm tracking-widest uppercase animate-pulse">Fetching...</p>
                    </div>
                )}

                {videoData && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pb-8"
                    >
                        <VideoPreview videoData={videoData} onDownload={handleDownload} />
                    </motion.div>
                )}
            </motion.div>

            {/* About Section - Shows on mobile when About tab is active */}
            {activeTab === 'about' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 w-full max-w-2xl mx-auto px-4 pb-24"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4">About NeonDownloader</h2>

                        <p className="text-gray-300 leading-relaxed">
                            NeonDownloader is a modern YouTube video downloader portal with a beautiful cyberpunk-themed interface.
                            We make it easy to download your favorite YouTube videos by connecting you to reliable download services.
                        </p>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-neon-blue">Features</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-blue mt-1">•</span>
                                    <span>Beautiful, modern UI with neon aesthetics</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-blue mt-1">•</span>
                                    <span>Mobile-first design with PWA support</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-blue mt-1">•</span>
                                    <span>Quick redirect to trusted download services</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-blue mt-1">•</span>
                                    <span>No ads, no tracking, completely free</span>
                                </li>
                            </ul>
                        </div>

                        {/* Creator & Partner Info on Mobile */}
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-xl border border-white/10">
                                <img
                                    src="/creator-logo.png"
                                    alt="EmmaTechnocom Logo"
                                    className="w-10 h-10 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-light tracking-wide uppercase">Created by</span>
                                    <span className="text-base font-bold bg-linear-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                                        EmmaTechnocom
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-xl border border-white/10">
                                <img
                                    src="/partner-logo.png"
                                    alt="Digital Flux Logo"
                                    className="w-10 h-10 object-contain"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-light tracking-wide uppercase">Partner</span>
                                    <span className="text-base font-bold text-white">
                                        Digital Flux
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Footer / Copyright - Hidden on Mobile to avoid clutter with Bottom Nav */}
            <div className="hidden md:flex absolute bottom-6 flex-col items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                {/* ... Footer Content ... */}
                <div className="flex flex-wrap justify-center gap-4">
                    {/* Creator */}
                    <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                        <img
                            src="/creator-logo.png"
                            alt="EmmaTechnocom Logo"
                            className="w-8 h-8 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] text-gray-400 font-light tracking-wide uppercase">Created by</span>
                            <span className="text-sm font-bold bg-linear-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                                EmmaTechnocom
                            </span>
                        </div>
                    </div>

                    {/* Partner */}
                    <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                        <img
                            src="/partner-logo.png"
                            alt="Digital Flux Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] text-gray-400 font-light tracking-wide uppercase">Partner</span>
                            <span className="text-sm font-bold text-white">
                                Digital Flux
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                    Web Developer &bull; AI Ethicist &bull; Strategic Partner
                </div>
            </div>

            <InstallPrompt />
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

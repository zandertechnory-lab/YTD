'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return; // Already installed
        }

        // Listen for the beforeinstallprompt event
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For iOS, show prompt after a delay
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && !window.navigator.standalone) {
            setTimeout(() => setShowPrompt(true), 3000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for 7 days
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    // Check if dismissed recently
    useEffect(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (dismissed) {
            const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
            if (daysSince < 7) {
                setShowPrompt(false);
            }
        }
    }, []);

    const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40"
                >
                    <div className="bg-black/90 backdrop-blur-xl border border-neon-blue/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-neon-blue/20 rounded-xl flex items-center justify-center shrink-0">
                                <Download className="text-neon-blue" size={24} />
                            </div>
                            <div className="flex-1 pr-6">
                                <h3 className="font-bold text-white mb-1">Install NeonDownloader</h3>
                                <p className="text-sm text-gray-300 mb-3">
                                    {isIOS
                                        ? 'Tap Share → Add to Home Screen'
                                        : 'Install our app for quick access and offline use'}
                                </p>
                                {!isIOS && deferredPrompt && (
                                    <button
                                        onClick={handleInstall}
                                        className="w-full bg-neon-blue text-black font-semibold py-2 px-4 rounded-lg hover:bg-neon-blue/90 transition-colors"
                                    >
                                        Install Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;

'use client';

import { Home, History, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = ({ activeTab = 'home', onTabChange }) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'about', icon: Info, label: 'About' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 flex justify-between items-center text-xs font-medium text-gray-400">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center gap-1.5 transition-colors duration-300 relative ${isActive ? 'text-neon-blue' : 'hover:text-white'}`}
                        >
                            <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-neon-blue/20 shadow-[0_0_10px_rgba(0,243,255,0.3)]' : ''}`}>
                                <Icon size={22} />
                            </div>
                            <span>{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;

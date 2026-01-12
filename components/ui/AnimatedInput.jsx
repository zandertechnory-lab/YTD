'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link as LinkIcon, X } from 'lucide-react';

const AnimatedInput = ({ value, onChange, placeholder, onSubmit, error }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        onChange({ target: { value: '' } });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <motion.div
                animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                className={`relative rounded-2xl p-[2px] overflow-hidden transition-all duration-300 ${isFocused ? 'bg-neon-gradient shadow-neon-blue' : 'bg-white/20'}`}
            >
                <div className="relative flex items-center bg-[#0f172a] rounded-2xl overflow-hidden">
                    <div className="pl-4 text-gray-400">
                        <LinkIcon className={`w-5 h-5 transition-colors ${isFocused ? 'text-neon-blue' : ''}`} />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-transparent text-white px-4 py-4 outline-none placeholder:text-gray-500"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                    />
                    <AnimatePresence>
                        {value && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={handleClear}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={onSubmit}
                        className={`px-6 py-4 transition-colors ${value ? 'bg-neon-purple text-white hover:bg-purple-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 text-center text-red-400 text-sm mt-2"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedInput;

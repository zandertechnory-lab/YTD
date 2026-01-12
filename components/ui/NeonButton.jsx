'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const NeonButton = ({
    children,
    onClick,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled = false,
    type = 'button'
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue hover:shadow-neon-purple',
        secondary: 'border border-neon-blue text-neon-blue hover:bg-neon-blue/10',
        ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    };

    const baseStyle = "relative overflow-hidden px-8 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                </>
            ) : children}

            {variant === 'primary' && !isLoading && !disabled && (
                <span className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-pulse-slow" />
            )}
        </motion.button>
    );
};

export default NeonButton;

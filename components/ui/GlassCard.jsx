'use client';

import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { scale: 1.02 } : {}}
            className={`glass rounded-2xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;

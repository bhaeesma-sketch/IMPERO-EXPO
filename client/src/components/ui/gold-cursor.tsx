import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const GoldCursor = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') !== null ||
                target.closest('a') !== null
            );
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden lg:block">
            {/* Main Cursor Ring */}
            <motion.div
                style={{
                    translateX: springX,
                    translateY: springY,
                    left: -16,
                    top: -16,
                }}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    borderWidth: isPointer ? 1 : 2,
                }}
                className="absolute w-8 h-8 rounded-full border border-[#BF953F] shadow-[0_0_10px_rgba(191,149,63,0.3)]"
            />

            {/* Center Dot */}
            <motion.div
                style={{
                    translateX: springX,
                    translateY: springY,
                    left: -2,
                    top: -2,
                }}
                animate={{
                    scale: isPointer ? 0 : 1,
                }}
                className="absolute w-1 h-1 bg-[#BF953F] rounded-full shadow-[0_0_5px_rgba(191,149,63,0.8)]"
            />

            {/* Shimmer Particles */}
            {[...Array(6)].map((_, i) => (
                <Particle key={i} x={cursorX} y={cursorY} delay={i * 0.2} />
            ))}
        </div>
    );
};

const Particle = ({ x, y, delay }: { x: any; y: any; delay: number }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPos({ x: x.get(), y: y.get() });
            setActive(true);
            setTimeout(() => setActive(false), 1000);
        }, 1500 + delay * 1000);

        return () => clearInterval(interval);
    }, [x, y, delay]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={active ? {
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0.5],
                x: pos.x + (Math.random() - 0.5) * 40,
                y: pos.y + (Math.random() - 0.5) * 40,
                rotate: [0, 180, 360],
            } : { opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-1 h-1 bg-[#FCF6BA] rounded-full blur-[1px]"
            style={{ left: 0, top: 0 }}
        />
    );
};

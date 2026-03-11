import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface VaultUnlockProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
}

const CORRECT_PIN = '1234';

export function VaultUnlock({ isOpen, onClose, onUnlock }: VaultUnlockProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    // Advanced Sound Synthesis
    const playTone = (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine', duration: number = 0.1) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePinInput = (digit: string) => {
        if (pin.length < 4 && !isVerifying && !success) {
            const newPin = pin + digit;
            setPin(newPin);
            playTone(1200 + (newPin.length * 200), 'sine', 0.15); // Ascending futuristic tones

            if (newPin.length === 4) {
                // Verify Phase
                setIsVerifying(true);
                playTone(800, 'square', 0.1); // Initiate scan sound

                setTimeout(() => {
                    if (newPin === CORRECT_PIN) {
                        setIsVerifying(false);
                        setSuccess(true);
                        playTone(2000, 'sine', 0.6); // Success chime
                        playTone(400, 'sine', 0.6); // Harmony

                        setTimeout(() => {
                            setShowWelcome(true);
                            setTimeout(onUnlock, 3000);
                        }, 800);
                    } else {
                        setIsVerifying(false);
                        setError(true);
                        playTone(150, 'sawtooth', 0.4); // Error buzz
                        setTimeout(() => {
                            setPin('');
                            setError(false);
                        }, 1000);
                    }
                }, 1500); // 1.5s Fake Verification Delay for "Realism"
            }
        }
    };

    const handleDelete = () => {
        if (pin.length > 0 && !isVerifying) {
            setPin(pin.slice(0, -1));
            playTone(600, 'sine', 0.1);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Immersive Backdrop with "Digital Dust" */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-[99999] flex items-center justify-center overflow-hidden"
                    >
                        {/* Background Gradient Mesh */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

                        {/* Animated Grid */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(197, 160, 89, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 89, 0.1) 1px, transparent 1px)',
                                backgroundSize: '50px 50px'
                            }}
                        />

                        {/* Floating Particles */}
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-primary/40 blur-[1px]"
                                style={{
                                    width: Math.random() * 4 + 1 + 'px',
                                    height: Math.random() * 4 + 1 + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%'
                                }}
                                animate={{
                                    y: [0, -100],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "linear"
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* MAIN INTERFACE */}
                    <AnimatePresence>
                        {showWelcome ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                className="fixed inset-0 z-[100001] flex items-center justify-center pointer-events-none"
                            >
                                <div className="text-center relative z-10 w-full max-w-4xl mx-auto">
                                    <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full" />

                                    <motion.div
                                        initial={{ scale: 0, rotateX: 90 }}
                                        animate={{ scale: 1, rotateX: 0 }}
                                        transition={{ duration: 1.2, type: "spring" }}
                                        className="mb-12 relative inline-block"
                                    >
                                        <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full animate-pulse" />
                                        <CheckCircle className="w-32 h-32 md:w-48 md:h-48 text-green-400 mx-auto drop-shadow-[0_0_60px_rgba(74,222,128,0.8)]" strokeWidth={0.5} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h1 className="font-serif text-6xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 via-primary to-yellow-700 mb-8 drop-shadow-2xl">
                                            ACCESS GRANTED
                                        </h1>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ delay: 0.8, duration: 1 }}
                                            className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-lg"
                                        />
                                        <p className="text-2xl md:text-3xl text-white font-light tracking-[0.5em] uppercase drop-shadow-lg">
                                            Welcome, Faizal
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
                            >
                                {/* Glass Panel Container */}
                                <div className="relative w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden">

                                    {/* Scanning Line Animation */}
                                    {isVerifying && (
                                        <motion.div
                                            className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-[20%]"
                                            animate={{ top: ['-20%', '120%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}

                                    {/* Header Section */}
                                    <div className="relative z-10 text-center mb-10">
                                        <motion.div
                                            animate={isVerifying ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] } : {}}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="inline-flex items-center justify-center mb-6 w-24 h-24 rounded-full bg-gradient-to-b from-gray-800 to-black border border-white/10 shadow-xl relative"
                                        >
                                            {isVerifying ? (
                                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            ) : error ? (
                                                <Shield className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" strokeWidth={1.5} />
                                            ) : (
                                                <Lock className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(197,160,89,0.6)]" strokeWidth={1.5} />
                                            )}
                                        </motion.div>

                                        <h2 className="font-serif text-3xl text-white tracking-widest mb-2">
                                            IMPERO <span className="text-primary font-bold">VAULT</span>
                                        </h2>
                                        <p className="text-xs text-gray-500 uppercase tracking-[0.4em] font-medium">
                                            {isVerifying ? "Verifying Credentials..." : error ? "Authentication Failed" : "Secure Touch Entry"}
                                        </p>
                                    </div>

                                    {/* PIN Display */}
                                    <div className="relative z-10 flex justify-center gap-6 mb-12">
                                        {[0, 1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-4 h-4 rounded-full transition-all duration-300 border ${pin[i]
                                                        ? 'bg-primary border-primary shadow-[0_0_20px_rgba(197,160,89,0.8)] scale-125'
                                                        : 'bg-transparent border-gray-600'
                                                    } ${error ? '!bg-red-500 !border-red-500 !shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''
                                                    } ${success ? '!bg-green-500 !border-green-500 !shadow-[0_0_20px_rgba(34,197,94,0.8)]' : ''
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Keypad */}
                                    <div className="relative z-10 grid grid-cols-3 gap-5 mb-8">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <motion.button
                                                key={num}
                                                onClick={() => handlePinInput(num.toString())}
                                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                                                whileTap={{ scale: 0.9 }}
                                                className="h-20 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm text-3xl font-light text-white transition-all shadow-inner hover:border-primary/40 hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                                            >
                                                {num}
                                            </motion.button>
                                        ))}

                                        {/* Blank / Placeholder */}
                                        <div />

                                        <motion.button
                                            onClick={() => handlePinInput('0')}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                                            whileTap={{ scale: 0.9 }}
                                            className="h-20 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm text-3xl font-light text-white transition-all shadow-inner hover:border-primary/40 hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                                        >
                                            0
                                        </motion.button>

                                        <motion.button
                                            onClick={handleDelete}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(239,68,68,0.1)" }}
                                            whileTap={{ scale: 0.9 }}
                                            className="h-20 rounded-3xl flex items-center justify-center text-gray-400 transition-colors hover:text-red-400"
                                        >
                                            <span className="text-sm font-bold tracking-wider">DEL</span>
                                        </motion.button>
                                    </div>

                                    {/* Footer */}
                                    <div className="relative z-10 text-center">
                                        <button
                                            onClick={onClose}
                                            className="text-gray-600 text-xs hover:text-white transition-colors tracking-[0.2em] uppercase hover:tracking-[0.3em] duration-300"
                                        >
                                            Emergency Exit
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

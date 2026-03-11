import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoCaptureProps {
    onCapture: () => void;
    capturedImage: string | null;
    onClose: () => void;
    onRetake: () => void;
    isCapturing: boolean;
}

export function PhotoCapture({
    onCapture,
    capturedImage,
    onClose,
    onRetake,
    isCapturing
}: PhotoCaptureProps) {
    const handleDownload = () => {
        if (!capturedImage) return;
        const a = document.createElement('a');
        a.href = capturedImage;
        a.download = `impero-luxury-tryon-${Date.now()}.png`;
        a.click();
    };

    const handleShare = async () => {
        if (!capturedImage) return;

        // Convert base64/blob URL to Blob for sharing
        try {
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            const file = new File([blob], 'impero-tryon.png', { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: 'My Impero Luxury Try-On',
                    text: 'Check out this stunning jewelry I tried on virtually at Impero!',
                    files: [file],
                });
            } else {
                // Fallback for desktop: copy to clipboard or just download
                handleDownload();
                alert('Image downloaded! You can now share it manually.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            handleDownload();
        }
    };

    return (
        <AnimatePresence>
            {capturedImage ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
                >
                    <div className="relative max-w-lg w-full bg-white rounded-lg overflow-hidden shadow-2xl">
                        <img
                            src={capturedImage}
                            alt="Captured Try-On"
                            className="w-full h-auto object-contain bg-black"
                        />

                        {/* Watermark Overlay */}
                        <div className="absolute bottom-4 right-4 text-white/90 text-xs font-serif tracking-widest pointer-events-none drop-shadow-md z-10">
                            IMPERO LUXURY
                        </div>

                        <div className="bg-white p-6 flex flex-col gap-4">
                            <div className="flex justify-center gap-4">
                                <Button
                                    onClick={handleShare}
                                    className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white gap-2"
                                >
                                    <Share2 className="w-4 h-4" /> Share
                                </Button>
                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    className="flex-1 gap-2"
                                >
                                    <Download className="w-4 h-4" /> Save
                                </Button>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={onRetake}
                                    variant="ghost"
                                    className="text-gray-500 hover:text-gray-900"
                                >
                                    Retake Photo
                                </Button>
                            </div>
                        </div>

                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-black/20 rounded-full z-20"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <div className="absolute bottom-28 left-0 right-0 flex justify-center z-40">
                    <Button
                        onClick={onCapture}
                        disabled={isCapturing}
                        className="w-20 h-20 rounded-full border-4 border-white/30 bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all transform hover:scale-110 flex items-center justify-center shadow-lg"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-black/80" />
                        </div>
                    </Button>
                </div>
            )}
        </AnimatePresence>
    );
}

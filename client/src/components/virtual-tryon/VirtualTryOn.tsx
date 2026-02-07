import { useState, useCallback, useRef, useEffect } from 'react';
import { HandTracking } from './HandTracking';
import { Results as HandResults } from '@mediapipe/hands';
import { Results } from '@mediapipe/face_mesh';
import { useCamera } from '@/hooks/useCamera';
import { FaceDetection } from './FaceDetection';
import { JewelryOverlay } from './JewelryOverlay';
import { PhotoCapture } from './ui/PhotoCapture';
import { SkinToneAnalyzer, AnalysisResult } from './ai/SkinToneAnalyzer';
import { Button } from '@/components/ui/button';
import { Camera, Download, X, ChevronLeft, ChevronRight, Sparkles, Wand2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';

interface VirtualTryOnProps {
    products: Product[];
    initialProductIndex?: number;
    onClose?: () => void;
}

export function VirtualTryOn({ products, initialProductIndex = 0, onClose }: VirtualTryOnProps) {
    const { stream, error, isLoading, videoRef, startCamera, stopCamera } = useCamera();
    const [faceResults, setFaceResults] = useState<Results | null>(null);
    const [handResults, setHandResults] = useState<HandResults | null>(null);
    const [currentProductIndex, setCurrentProductIndex] = useState(initialProductIndex);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [earringStyle, setEarringStyle] = useState<'stud' | 'hoop' | 'drop'>('stud');
    const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const currentProduct = products[currentProductIndex];
    const productType = currentProduct?.type === 'jewelry' ?
        (currentProduct.name.toLowerCase().includes('earring') ? 'earrings' :
            currentProduct.name.toLowerCase().includes('ring') ? 'ring' :
                currentProduct.name.toLowerCase().includes('nose') ? 'nose_ring' :
                    currentProduct.name.toLowerCase().includes('bracelet') ? 'bracelet' :
                        'necklace') :
        'necklace';

    // Extract purity from product, default to 22K
    const purity = (currentProduct?.purity || '22K') as '18K' | '21K' | '22K' | '24K';

    // Handle Resize for Overlay Alignment
    useEffect(() => {
        const updateDimensions = () => {
            if (videoRef.current) {
                const videoRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
                // Calculate size that fits in window while maintaining aspect ratio
                // This mimics object-contain but gives us the exact dimensions of the video content
                const windowRatio = window.innerWidth / window.innerHeight;

                let renderWidth, renderHeight;

                if (windowRatio > videoRatio) {
                    // Window is wider than video -> limited by height
                    renderHeight = window.innerHeight;
                    renderWidth = renderHeight * videoRatio;
                } else {
                    // Window is taller than video -> limited by width
                    renderWidth = window.innerWidth;
                    renderHeight = renderWidth / videoRatio;
                }

                setContainerDimensions({
                    width: renderWidth || window.innerWidth,
                    height: renderHeight || window.innerHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        // Also update on video metadata load
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', updateDimensions);
        }
        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', updateDimensions);
            }
        };
    }, [stream]);


    const handleResults = useCallback((results: Results) => {
        setFaceResults(results);
    }, []);

    const handleHandResults = useCallback((results: HandResults) => {
        setHandResults(results);
    }, []);

    const handleStartCamera = async () => {
        await startCamera(cameraMode);
        setShowInstructions(false);
    };

    const handleToggleCamera = async () => {
        const newMode = cameraMode === 'user' ? 'environment' : 'user';
        setCameraMode(newMode);
        await startCamera(newMode);
    };

    const handleCapture = () => {
        if (!videoRef.current) return;

        setIsCapturing(true);

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Draw video frame
            // Note: If text/overlay mirroring is needed, transform here.
            ctx.drawImage(videoRef.current, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setCapturedImage(url);
                }
                setIsCapturing(false);
            });
        }
    };

    const handleAIAnalysis = () => {
        if (!videoRef.current || !faceResults?.multiFaceLandmarks?.[0]) return;

        setIsAnalyzing(true);
        // Simulate a brief "thinking" delay for UX
        setTimeout(() => {
            try {
                if (videoRef.current && faceResults?.multiFaceLandmarks?.[0]) {
                    const result = SkinToneAnalyzer.analyze(videoRef.current, faceResults.multiFaceLandmarks[0]);
                    setAnalysisResult(result);
                }
            } catch (e) {
                console.error("AI Analysis failed", e);
            }
            setIsAnalyzing(false);
        }, 1500);
    };

    const nextProduct = () => {
        setCurrentProductIndex((prev: number) => (prev + 1) % products.length);
    };

    const prevProduct = () => {
        setCurrentProductIndex((prev: number) => (prev - 1 + products.length) % products.length);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 pt-12 pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="bg-black/30 backdrop-blur-md border-white/20 text-white hover:bg-black/50"
                            onClick={() => {
                                stopCamera();
                                if (onClose) onClose();
                            }}
                        >
                            <X className="mr-2 w-4 h-4" />
                            Exit
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-purple-600/80 backdrop-blur-md border-white/20 text-white hover:bg-purple-700/80"
                            onClick={handleAIAnalysis}
                            disabled={isAnalyzing || !faceResults}
                        >
                            <Wand2 className={`mr-2 w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            {isAnalyzing ? 'Analyzing...' : 'AI Stylist'}
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-black/30 backdrop-blur-md border-white/20 text-white hover:bg-black/50"
                            onClick={handleToggleCamera}
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* AI Analysis Result Modal */}
            <AnimatePresence>
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-sm w-full z-[60] pointer-events-auto text-center border border-white/50"
                    >
                        <div className="mb-4 flex justify-center">
                            <span className="p-3 bg-purple-100 rounded-full">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                            </span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-2 text-gray-900">Analysis Complete</h3>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Skin Tone</p>
                            <p className="text-lg font-bold text-gray-900 capitalize mb-4">{analysisResult.skinTone}</p>

                            <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Recommendation</p>
                            <p className="text-lg font-medium text-purple-700">{analysisResult.recommendedMetal}</p>
                        </div>
                        <p className="text-gray-600 mb-8 italic text-sm">
                            "{analysisResult.description}"
                        </p>
                        <Button
                            className="w-full bg-black text-white hover:bg-gray-800"
                            onClick={() => setAnalysisResult(null)}
                        >
                            Try Recommended Jewelry
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Camera View Wrapper - Handles proper aspect ratio */}
            <div
                className="relative flex items-center justify-center overflow-hidden shadow-2xl"
                style={{
                    width: containerDimensions.width || '100%',
                    height: containerDimensions.height || '100%'
                }}
            >
                {!stream && !error && (
                    <AnimatePresence>
                        {showInstructions && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-8 text-center"
                            >
                                <Camera className="w-20 h-20 text-primary mb-6" />
                                <h3 className="text-white font-serif text-3xl mb-4">Ready to Try On?</h3>
                                <p className="text-gray-300 text-center max-w-md mb-8">
                                    We'll use your camera to show how our jewelry looks on you in real-time.
                                    Your privacy is important - nothing is recorded or saved.
                                </p>
                                <Button
                                    onClick={handleStartCamera}
                                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Starting Camera...' : 'Start Camera'}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-30">
                        <div className="text-center text-white p-8">
                            <p className="text-red-400 mb-4">Camera Error: {error}</p>
                            <Button onClick={handleStartCamera} variant="outline">
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}

                {/* The Video Element */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-contain ${cameraMode === 'user' ? 'transform -scale-x-100' : ''}`}
                />

                {/* The Overlay */}
                {stream && videoRef.current && (
                    <div className={`absolute inset-0 w-full h-full pointer-events-none ${cameraMode === 'user' ? 'transform -scale-x-100' : ''}`} >
                        {/* Note: Overlay itself shouldn't be flipped via CSS if MediaPipe results assume flipped or not. 
                             Usually MediaPipe coordinates match the video source. 
                             If we flip the video visually, we flip the coordinate system too.
                             So we wrap all overlays in a div that matches the video's flip state. 
                          */}
                        <FaceDetection
                            videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                            onResults={handleResults}
                        />
                        <HandTracking
                            videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                            onResults={handleHandResults}
                            enabled={productType === 'ring' || productType === 'bracelet'}
                        />
                        <JewelryOverlay
                            faceResults={faceResults}
                            handResults={handResults}
                            productType={productType}
                            canvasWidth={containerDimensions.width}
                            canvasHeight={containerDimensions.height}
                            purity={purity}
                            earringStyle={earringStyle}
                        />
                    </div>
                )}
            </div>

            {/* Captured Image Modal */}
            <PhotoCapture
                capturedImage={capturedImage}
                onClose={() => setCapturedImage(null)}
                onRetake={() => setCapturedImage(null)}
                onCapture={handleCapture}
                isCapturing={isCapturing}
            />

            {/* Product Selector */}
            {
                stream && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-40">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevProduct}
                                className="text-white hover:bg-white/20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            <div className="flex-1 mx-4 text-center">
                                <p className="text-white font-serif text-xl mb-2">{currentProduct.name}</p>
                                <p className="text-gray-300 text-sm">{currentProduct.purity} Gold</p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextProduct}
                                className="text-white hover:bg-white/20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

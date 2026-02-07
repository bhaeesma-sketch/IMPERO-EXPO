import { useState, useEffect, useRef } from 'react';

export function useCamera() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const startCamera = async (facingMode: 'user' | 'environment' = 'user') => {
        setIsLoading(true);
        setError(null);

        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: facingMode,
                },
                audio: false,
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
            setError(errorMessage);
            console.error('Camera access error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return {
        stream,
        error,
        isLoading,
        videoRef,
        startCamera,
        stopCamera,
    };
}

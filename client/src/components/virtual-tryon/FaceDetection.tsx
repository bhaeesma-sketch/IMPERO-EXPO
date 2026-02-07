import { useEffect, useRef, useState } from 'react';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

interface FaceDetectionProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    onResults: (results: Results) => void;
}

export function FaceDetection({ videoRef, onResults }: FaceDetectionProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);
        faceMeshRef.current = faceMesh;

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current && faceMeshRef.current) {
                    await faceMeshRef.current.send({ image: videoRef.current });
                }
            },
            width: 1280,
            height: 720,
        });

        camera.start();
        cameraRef.current = camera;
        setIsInitialized(true);

        return () => {
            camera.stop();
            faceMesh.close();
        };
    }, [videoRef, onResults]);

    return null;
}

// Landmark indices for jewelry positioning
export const LANDMARKS = {
    // Earrings
    LEFT_EAR: 234,
    RIGHT_EAR: 454,

    // Necklace
    NECK_TOP: 152,
    NECK_LEFT: 234,
    NECK_RIGHT: 454,
    CHIN: 152,

    // Face bounds
    FOREHEAD: 10,
    LEFT_CHEEK: 234,
    RIGHT_CHEEK: 454,
    NOSE_TIP: 1,
    NOSE_LEFT: 279,
    NOSE_RIGHT: 49,
    SEPTUM: 2,
};

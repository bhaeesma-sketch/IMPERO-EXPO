import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface HandTrackingProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    onResults: (results: Results) => void;
    enabled: boolean;
}

export function HandTracking({ videoRef, onResults, enabled }: HandTrackingProps) {
    const handsRef = useRef<Hands | null>(null);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        if (!videoRef.current || !enabled) return;

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current && handsRef.current && enabled) {
                    await handsRef.current.send({ image: videoRef.current });
                }
            },
            width: 1280,
            height: 720,
        });

        camera.start();
        cameraRef.current = camera;

        return () => {
            camera.stop();
            hands.close();
        };
    }, [videoRef, onResults, enabled]);

    return null;
}

// Hand landmark indices
export const HAND_LANDMARKS = {
    WRIST: 0,
    THUMB_CMC: 1,
    THUMB_MCP: 2,
    THUMB_IP: 3,
    THUMB_TIP: 4,
    INDEX_FINGER_MCP: 5,
    INDEX_FINGER_PIP: 6,
    INDEX_FINGER_DIP: 7,
    INDEX_FINGER_TIP: 8,
    MIDDLE_FINGER_MCP: 9,
    MIDDLE_FINGER_PIP: 10,
    MIDDLE_FINGER_DIP: 11,
    MIDDLE_FINGER_TIP: 12,
    RING_FINGER_MCP: 13,
    RING_FINGER_PIP: 14,
    RING_FINGER_DIP: 15,
    RING_FINGER_TIP: 16,
    PINKY_MCP: 17,
    PINKY_PIP: 18,
    PINKY_DIP: 19,
    PINKY_TIP: 20,
};

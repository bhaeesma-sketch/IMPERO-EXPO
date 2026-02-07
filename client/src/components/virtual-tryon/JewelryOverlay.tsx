import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring as ThreeRing } from '@react-three/drei';
import * as THREE from 'three';
import { Results } from '@mediapipe/face_mesh';
import { Results as HandResults } from '@mediapipe/hands';
import { LANDMARKS } from './FaceDetection';
import { HAND_LANDMARKS } from './HandTracking';
import { RealisticNecklace } from './jewelry-models/RealisticNecklace';
import { RealisticEarring } from './jewelry-models/RealisticEarring';
import { RealisticRing } from './jewelry-models/RealisticRing';
import { RealisticBracelet } from './jewelry-models/RealisticBracelet';
import { RealisticNoseRing } from './jewelry-models/RealisticNoseRing';
import { LightingSystem } from './effects/LightingSystem';

interface JewelryOverlayProps {
    faceResults: Results | null;
    handResults?: HandResults | null;
    productType: 'necklace' | 'earrings' | 'ring' | 'bracelet' | 'nose_ring';
    canvasWidth: number;
    canvasHeight: number;
    purity?: '18K' | '21K' | '22K' | '24K';
    earringStyle?: 'stud' | 'hoop' | 'drop';
}

export function JewelryOverlay({
    faceResults,
    handResults,
    productType,
    canvasWidth,
    canvasHeight,
    purity = '22K',
    earringStyle = 'stud'
}: JewelryOverlayProps) {
    // Face tracking logic
    const renderFaceJewelry = () => {
        if (!faceResults || !faceResults.multiFaceLandmarks || faceResults.multiFaceLandmarks.length === 0) {
            return null;
        }

        const landmarks = faceResults.multiFaceLandmarks[0];

        const convertToThreeJS = (landmark: { x: number; y: number; z: number }): [number, number, number] => {
            return [
                (landmark.x - 0.5) * 2,
                -(landmark.y - 0.5) * 2,
                -landmark.z * 2,
            ];
        };

        const leftEar = convertToThreeJS(landmarks[LANDMARKS.LEFT_EAR]);
        const rightEar = convertToThreeJS(landmarks[LANDMARKS.RIGHT_EAR]);
        const chin = convertToThreeJS(landmarks[LANDMARKS.CHIN]);
        const neckLeft = convertToThreeJS(landmarks[LANDMARKS.NECK_LEFT]);
        const neckRight = convertToThreeJS(landmarks[LANDMARKS.NECK_RIGHT]);
        const noseLeft = convertToThreeJS(landmarks[LANDMARKS.NOSE_LEFT]);

        // Calculate scale based on face size
        const faceWidth = Math.abs(leftEar[0] - rightEar[0]);
        const scale = faceWidth * 2;

        return (
            <>
                {productType === 'earrings' && (
                    <>
                        <RealisticEarring
                            position={leftEar}
                            scale={scale}
                            purity={purity}
                            style={earringStyle}
                        />
                        <RealisticEarring
                            position={rightEar}
                            scale={scale}
                            purity={purity}
                            style={earringStyle}
                        />
                    </>
                )}
                {productType === 'nose_ring' && (
                    <RealisticNoseRing
                        position={noseLeft}
                        scale={scale}
                        purity={purity}
                        style="stud"
                    />
                )}

                {productType === 'necklace' && (
                    <RealisticNecklace
                        points={[
                            neckLeft,
                            [(neckLeft[0] + chin[0]) / 2, (neckLeft[1] + chin[1]) / 2 - 0.1, (neckLeft[2] + chin[2]) / 2],
                            [chin[0], chin[1] - 0.15, chin[2]],
                            [(neckRight[0] + chin[0]) / 2, (neckRight[1] + chin[1]) / 2 - 0.1, (neckRight[2] + chin[2]) / 2],
                            neckRight,
                        ]}
                        scale={scale}
                        purity={purity}
                    />
                )}
            </>
        );
    };

    // Hand tracking logic
    const renderHandJewelry = () => {
        if (!handResults || !handResults.multiHandLandmarks || handResults.multiHandLandmarks.length === 0) {
            return null;
        }

        const landmarks = handResults.multiHandLandmarks[0];

        const convertToThreeJS = (landmark: { x: number; y: number; z: number }): [number, number, number] => {
            return [
                (landmark.x - 0.5) * 2,
                -(landmark.y - 0.5) * 2,
                -landmark.z * 2,
            ];
        };

        const ringFingerMCP = convertToThreeJS(landmarks[HAND_LANDMARKS.RING_FINGER_MCP]);
        const ringFingerPIP = convertToThreeJS(landmarks[HAND_LANDMARKS.RING_FINGER_PIP]);
        const wrist = convertToThreeJS(landmarks[HAND_LANDMARKS.WRIST]);
        const middleFingerMCP = convertToThreeJS(landmarks[HAND_LANDMARKS.MIDDLE_FINGER_MCP]);

        // Place ring at base of finger (between MCP and PIP)
        const position: [number, number, number] = [
            (ringFingerMCP[0] + ringFingerPIP[0]) / 2,
            (ringFingerMCP[1] + ringFingerPIP[1]) / 2,
            (ringFingerMCP[2] + ringFingerPIP[2]) / 2,
        ];

        // Calculate rotation based on finger direction
        const direction = new THREE.Vector3().subVectors(
            new THREE.Vector3(...ringFingerPIP),
            new THREE.Vector3(...ringFingerMCP)
        ).normalize();

        const rotation = new THREE.Euler().setFromVector3(direction);

        // Calculate scale based on finger width (approximate)
        const scale = new THREE.Vector3(...ringFingerMCP).distanceTo(new THREE.Vector3(...ringFingerPIP)) * 2;

        // Bracelet positioning
        const braceletPosition = wrist;
        const armDirection = new THREE.Vector3().subVectors(
            new THREE.Vector3(...middleFingerMCP),
            new THREE.Vector3(...wrist)
        ).normalize();

        const braceletRotation = new THREE.Euler().setFromVector3(armDirection);
        const braceletScale = 0.8;

        return (
            <>
                {productType === 'ring' && (
                    <RealisticRing
                        position={position}
                        rotation={[rotation.x + Math.PI / 2, rotation.y, rotation.z]}
                        scale={scale}
                        purity={purity}
                    />
                )}
                {productType === 'bracelet' && (
                    <RealisticBracelet
                        position={braceletPosition}
                        rotation={[braceletRotation.x + Math.PI / 2, braceletRotation.y, braceletRotation.z]}
                        scale={braceletScale}
                        purity={purity}
                        style="bangle"
                    />
                )}
            </>
        );
    };

    return (
        <Canvas
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: canvasWidth,
                height: canvasHeight,
                pointerEvents: 'none',
            }}
            camera={{ position: [0, 0, 1], fov: 50 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            }}
        >
            {/* Enhanced lighting system */}
            <LightingSystem intensity={1.2} preset="studio" />

            {/* Render jewelry based on type */}
            {(productType === 'necklace' || productType === 'earrings') && renderFaceJewelry()}
            {(productType === 'ring' || productType === 'bracelet') && renderHandJewelry()}

        </Canvas>
    );
}

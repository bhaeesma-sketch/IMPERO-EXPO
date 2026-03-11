import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticNoseRingProps {
    position: [number, number, number];
    scale: number;
    purity: '18K' | '21K' | '22K' | '24K';
    style?: 'stud' | 'ring';
}

const GOLD_COLORS = {
    '24K': '#FFD700',
    '22K': '#F4C430',
    '21K': '#F0C020',
    '18K': '#E8B810',
};

const GOLD_PROPERTIES = {
    '24K': { metalness: 0.95, roughness: 0.05, emissiveIntensity: 0.4 },
    '22K': { metalness: 0.92, roughness: 0.08, emissiveIntensity: 0.35 },
    '21K': { metalness: 0.90, roughness: 0.10, emissiveIntensity: 0.3 },
    '18K': { metalness: 0.88, roughness: 0.12, emissiveIntensity: 0.25 },
};

export function RealisticNoseRing({ position, scale, purity, style = 'stud' }: RealisticNoseRingProps) {
    const color = GOLD_COLORS[purity];
    const properties = GOLD_PROPERTIES[purity];
    const groupRef = useRef<THREE.Group>(null);

    // Adjust scale for nose ring (smaller than earrings)
    const noseScale = scale * 0.15;

    return (
        <group position={position} ref={groupRef}>
            {style === 'stud' && (
                <Sphere args={[0.02, 32, 32]} scale={noseScale}>
                    <meshStandardMaterial
                        color={color}
                        metalness={properties.metalness}
                        roughness={properties.roughness}
                        emissive={color}
                        emissiveIntensity={properties.emissiveIntensity}
                        envMapIntensity={2.0}
                    />
                </Sphere>
            )}

            {style === 'ring' && (
                <group rotation={[0, Math.PI / 2, 0]} scale={noseScale}>
                    <Torus args={[0.04, 0.005, 16, 32]}>
                        <meshStandardMaterial
                            color={color}
                            metalness={properties.metalness}
                            roughness={properties.roughness}
                            emissive={color}
                            emissiveIntensity={properties.emissiveIntensity}
                            envMapIntensity={2.0}
                        />
                    </Torus>
                </group>
            )}
            {/* Add a tiny diamond for stud? */}
            {style === 'stud' && (
                <Sphere args={[0.01, 16, 16]} position={[0, 0, 0.015]} scale={noseScale}>
                    <meshStandardMaterial
                        color="white"
                        metalness={0.1}
                        roughness={0.0}
                        emissive="white"
                        emissiveIntensity={0.5}
                    />
                </Sphere>
            )}
        </group>
    );
}

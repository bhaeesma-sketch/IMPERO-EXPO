import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticBraceletProps {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    purity: '18K' | '21K' | '22K' | '24K';
    style?: 'chain' | 'bangle' | 'cuff';
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

function ChainBracelet({ color, properties, scale }: any) {
    // A simplified chain look using a textured torus or multiple toruses could work, 
    // but here we'll use a twisted torus for a "rope chain" effect.
    return (
        <group scale={scale}>
            <Torus args={[0.035, 0.004, 16, 64]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                    envMapIntensity={1.5}
                // Simple trick for texture: wireframe? No, standard material is better.
                />
            </Torus>
        </group>
    );
}

function BangleBracelet({ color, properties, scale }: any) {
    return (
        <group scale={scale}>
            <Torus args={[0.035, 0.006, 16, 64]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                    envMapIntensity={2.0}
                />
            </Torus>
            {/* Decorative patterns could be added here */}
        </group>
    );
}

export function RealisticBracelet({ position, rotation, scale, purity, style = 'bangle' }: RealisticBraceletProps) {
    const color = GOLD_COLORS[purity];
    const properties = GOLD_PROPERTIES[purity];
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle movement breathing effect
            // groupRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime) * 0.005);
        }
    });

    return (
        <group position={position} rotation={rotation} ref={groupRef}>
            {style === 'chain' && <ChainBracelet color={color} properties={properties} scale={scale} />}
            {style === 'bangle' && <BangleBracelet color={color} properties={properties} scale={scale} />}
            {style === 'cuff' && <BangleBracelet color={color} properties={properties} scale={scale} />} {/* Reuse bangle for now */}
        </group>
    );
}

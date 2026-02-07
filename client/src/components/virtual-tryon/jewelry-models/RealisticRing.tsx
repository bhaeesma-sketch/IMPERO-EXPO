import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticRingProps {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    purity: '18K' | '21K' | '22K' | '24K';
    stone?: 'diamond' | 'ruby' | 'emerald' | 'sapphire';
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

const STONE_COLORS = {
    diamond: { color: '#FFFFFF', ior: 2.42, transmission: 0.95 },
    ruby: { color: '#E0115F', ior: 1.76, transmission: 0.6 },
    emerald: { color: '#50C878', ior: 1.57, transmission: 0.6 },
    sapphire: { color: '#0F52BA', ior: 1.77, transmission: 0.6 },
};

export function RealisticRing({ position, rotation, scale, purity, stone = 'diamond' }: RealisticRingProps) {
    const color = GOLD_COLORS[purity];
    const properties = GOLD_PROPERTIES[purity];
    const stoneProps = STONE_COLORS[stone];
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle sparkle rotation
            meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime) * 0.02;
        }
    });

    return (
        <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
            {/* Ring Band */}
            <Torus args={[0.018, 0.002, 16, 32]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                    envMapIntensity={1.5}
                />
            </Torus>

            {/* Solitaire Setting */}
            <group position={[0, 0.02, 0]}>
                {/* Prongs */}
                {[0, 90, 180, 270].map((angle, i) => (
                    <mesh key={i} position={[Math.sin(angle * Math.PI / 180) * 0.003, 0.002, Math.cos(angle * Math.PI / 180) * 0.003]} rotation={[0, 0, 0]}>
                        <cylinderGeometry args={[0.0005, 0.0005, 0.006, 8]} />
                        <meshStandardMaterial
                            color={color}
                            metalness={properties.metalness}
                            roughness={properties.roughness}
                        />
                    </mesh>
                ))}

                {/* Main Stone */}
                <mesh position={[0, 0.003, 0]}>
                    <octahedronGeometry args={[0.005, 0]} />
                    <meshPhysicalMaterial
                        color={stoneProps.color}
                        metalness={0.0}
                        roughness={0.0}
                        transmission={stoneProps.transmission}
                        thickness={0.5}
                        ior={stoneProps.ior}
                        transparent
                        opacity={0.95}
                        envMapIntensity={2.5}
                        clearcoat={1.0}
                    />
                </mesh>

                {/* Sparkle Glow */}
                <pointLight position={[0, 0.005, 0]} intensity={0.5} color={stoneProps.color} distance={0.05} />
            </group>
        </group>
    );
}

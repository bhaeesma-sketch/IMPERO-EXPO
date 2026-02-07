import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticEarringProps {
    position: [number, number, number];
    scale: number;
    purity: '18K' | '21K' | '22K' | '24K';
    style?: 'stud' | 'hoop' | 'drop';
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

function StudEarring({ color, properties, scale }: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group scale={scale}>
            {/* Diamond stud */}
            <mesh ref={meshRef}>
                <octahedronGeometry args={[0.018, 0]} />
                <meshPhysicalMaterial
                    color="#FFFFFF"
                    metalness={0.0}
                    roughness={0.0}
                    transmission={0.95}
                    thickness={0.5}
                    ior={2.42}
                    transparent
                    opacity={0.98}
                    envMapIntensity={2.5}
                    clearcoat={1.0}
                    clearcoatRoughness={0.0}
                />
            </mesh>

            {/* Gold setting */}
            <Sphere args={[0.012, 16, 16]} position={[0, 0, 0.005]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                />
            </Sphere>

            {/* Sparkle effect */}
            <pointLight position={[0, 0, 0]} intensity={0.3} color="#FFFFFF" distance={0.08} />
        </group>
    );
}

function HoopEarring({ color, properties, scale }: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle swaying motion
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
        }
    });

    return (
        <group scale={scale} ref={meshRef}>
            {/* Main hoop */}
            <Torus args={[0.025, 0.003, 16, 32]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                    envMapIntensity={1.5}
                />
            </Torus>

            {/* Small diamonds on hoop */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
                const x = Math.cos(angle) * 0.025;
                const y = Math.sin(angle) * 0.025;
                return (
                    <Sphere key={i} args={[0.004, 12, 12]} position={[x, y, 0]}>
                        <meshPhysicalMaterial
                            color="#FFFFFF"
                            metalness={0.0}
                            roughness={0.0}
                            transmission={0.9}
                            ior={2.42}
                            transparent
                            opacity={0.95}
                            envMapIntensity={2.0}
                        />
                    </Sphere>
                );
            })}
        </group>
    );
}

function DropEarring({ color, properties, scale }: any) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Pendulum motion
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.08;
        }
    });

    return (
        <group ref={meshRef} scale={scale}>
            {/* Top stud */}
            <Sphere args={[0.01, 16, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                />
            </Sphere>

            {/* Connecting chain */}
            <mesh position={[0, -0.02, 0]}>
                <cylinderGeometry args={[0.001, 0.001, 0.03, 8]} />
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                />
            </mesh>

            {/* Drop pendant (teardrop shape) */}
            <group position={[0, -0.045, 0]}>
                {/* Diamond teardrop */}
                <mesh rotation={[0, 0, Math.PI]}>
                    <coneGeometry args={[0.015, 0.035, 16]} />
                    <meshPhysicalMaterial
                        color="#FFFFFF"
                        metalness={0.0}
                        roughness={0.0}
                        transmission={0.95}
                        thickness={0.5}
                        ior={2.42}
                        transparent
                        opacity={0.98}
                        envMapIntensity={2.5}
                        clearcoat={1.0}
                        clearcoatRoughness={0.0}
                    />
                </mesh>

                {/* Top sphere for teardrop */}
                <Sphere args={[0.015, 16, 16]} position={[0, 0.015, 0]}>
                    <meshPhysicalMaterial
                        color="#FFFFFF"
                        metalness={0.0}
                        roughness={0.0}
                        transmission={0.95}
                        thickness={0.5}
                        ior={2.42}
                        transparent
                        opacity={0.98}
                        envMapIntensity={2.5}
                    />
                </Sphere>

                {/* Sparkle */}
                <pointLight position={[0, 0, 0]} intensity={0.4} color="#FFFFFF" distance={0.1} />
            </group>
        </group>
    );
}

export function RealisticEarring({ position, scale, purity, style = 'stud' }: RealisticEarringProps) {
    const color = GOLD_COLORS[purity];
    const properties = GOLD_PROPERTIES[purity];

    return (
        <group position={position}>
            {style === 'stud' && <StudEarring color={color} properties={properties} scale={scale} />}
            {style === 'hoop' && <HoopEarring color={color} properties={properties} scale={scale} />}
            {style === 'drop' && <DropEarring color={color} properties={properties} scale={scale} />}
        </group>
    );
}

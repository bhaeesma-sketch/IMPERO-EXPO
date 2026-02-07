import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticNecklaceProps {
    points: [number, number, number][];
    scale: number;
    purity: '18K' | '21K' | '22K' | '24K';
    productImage?: string;
}

// Gold color mapping based on purity
const GOLD_COLORS = {
    '24K': '#FFD700', // Pure gold - bright yellow
    '22K': '#F4C430', // Slightly lighter
    '21K': '#F0C020', // Medium gold
    '18K': '#E8B810', // Rose gold tint
};

const GOLD_PROPERTIES = {
    '24K': { metalness: 0.95, roughness: 0.05, emissiveIntensity: 0.4 },
    '22K': { metalness: 0.92, roughness: 0.08, emissiveIntensity: 0.35 },
    '21K': { metalness: 0.90, roughness: 0.10, emissiveIntensity: 0.3 },
    '18K': { metalness: 0.88, roughness: 0.12, emissiveIntensity: 0.25 },
};

function ChainLink({ position, rotation, scale, color, properties }: any) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            <Torus args={[0.004, 0.0015, 8, 16]}>
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                    envMapIntensity={1.5}
                />
            </Torus>
        </group>
    );
}

function DiamondPendant({ position, scale }: { position: [number, number, number]; scale: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation for sparkle effect
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
            meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    return (
        <group position={position} scale={scale}>
            {/* Diamond - octahedron shape */}
            <mesh ref={meshRef}>
                <octahedronGeometry args={[0.025, 0]} />
                <meshPhysicalMaterial
                    color="#FFFFFF"
                    metalness={0.0}
                    roughness={0.0}
                    transmission={0.95}
                    thickness={0.5}
                    ior={2.42} // Diamond's refractive index
                    transparent
                    opacity={0.98}
                    envMapIntensity={2.0}
                    clearcoat={1.0}
                    clearcoatRoughness={0.0}
                />
            </mesh>

            {/* Inner glow for sparkle */}
            <pointLight position={[0, 0, 0]} intensity={0.5} color="#FFFFFF" distance={0.1} />
        </group>
    );
}

export function RealisticNecklace({ points, scale, purity, productImage }: RealisticNecklaceProps) {
    const groupRef = useRef<THREE.Group>(null);
    const color = GOLD_COLORS[purity];
    const properties = GOLD_PROPERTIES[purity];

    // Generate curve points for smooth necklace
    const curvePoints = points.length >= 2
        ? new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))).getPoints(100)
        : [];

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle movement for realism
            groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.0001;
        }
    });

    if (curvePoints.length === 0) return null;

    // Calculate pendant position (center bottom of necklace)
    const pendantIndex = Math.floor(curvePoints.length / 2);
    const pendantPos = curvePoints[pendantIndex];

    return (
        <group ref={groupRef} scale={scale}>
            {/* Main chain using tube geometry */}
            <mesh>
                <tubeGeometry args={[new THREE.CatmullRomCurve3(curvePoints), 100, 0.0025, 12, false]} />
                <meshStandardMaterial
                    color={color}
                    metalness={properties.metalness}
                    roughness={properties.roughness}
                    emissive={color}
                    emissiveIntensity={properties.emissiveIntensity}
                    envMapIntensity={1.5}
                />
            </mesh>

            {/* Chain links for detail (every 10th point) */}
            {curvePoints.filter((_, i) => i % 10 === 0).map((point, i) => {
                const nextPoint = curvePoints[Math.min(i * 10 + 1, curvePoints.length - 1)];
                const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize();
                const rotation = new THREE.Euler().setFromVector3(direction);

                return (
                    <ChainLink
                        key={i}
                        position={[point.x, point.y, point.z]}
                        rotation={rotation}
                        scale={1}
                        color={color}
                        properties={properties}
                    />
                );
            })}

            {/* Diamond pendant */}
            <DiamondPendant
                position={[pendantPos.x, pendantPos.y - 0.06, pendantPos.z]}
                scale={1.2}
            />

            {/* Pendant setting (gold) */}
            <group position={[pendantPos.x, pendantPos.y - 0.04, pendantPos.z]}>
                <Cylinder args={[0.015, 0.018, 0.008, 16]}>
                    <meshStandardMaterial
                        color={color}
                        metalness={properties.metalness}
                        roughness={properties.roughness}
                        emissive={color}
                        emissiveIntensity={properties.emissiveIntensity}
                    />
                </Cylinder>
            </group>

            {/* Additional small diamonds along the chain (optional luxury detail) */}
            {[0.25, 0.5, 0.75].map((ratio, i) => {
                const index = Math.floor(curvePoints.length * ratio);
                const point = curvePoints[index];
                return (
                    <Sphere key={`diamond-${i}`} args={[0.008, 16, 16]} position={[point.x, point.y, point.z]}>
                        <meshPhysicalMaterial
                            color="#FFFFFF"
                            metalness={0.0}
                            roughness={0.0}
                            transmission={0.9}
                            ior={2.42}
                            transparent
                            opacity={0.95}
                            envMapIntensity={1.8}
                        />
                    </Sphere>
                );
            })}
        </group>
    );
}

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles, ContactShadows } from '@react-three/drei';
import { Product } from '@/lib/products';
import * as THREE from 'three';

interface Product3DViewerProps {
    product: Product;
}

// --- Luxury Gold Shader Materials ---
const useGoldMaterial = (purity: string) => {
    return useMemo(() => {
        const isSilver = purity === 'Silver';
        return new THREE.MeshPhysicalMaterial({
            color: isSilver ? '#E5E4E2' : '#FFD700',
            metalness: 0.98,
            roughness: 0.05,
            reflectivity: 1,
            envMapIntensity: 2.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            iridescence: 0.1,
            iridescenceIOR: 1.5,
        });
    }, [purity]);
};

// --- Realistic Diamond/Gem Material ---
const useGemMaterial = (color: string = '#FFFFFF') => {
    return useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.98,
            thickness: 0.8,
            ior: 2.417, // Diamond IOR
            transparent: true,
            opacity: 1,
            envMapIntensity: 3.0,
            clearcoat: 1.0,
            dispersion: 5.0, // R3F physical material dispersion
        } as any);
    }, [color]);
};

// --- High Fidelity Ring Model ---
const RealisticRing = ({ goldMat, gemMat }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Main Band - Comfort fit shank */}
            <mesh material={goldMat} castShadow>
                <torusGeometry args={[1, 0.15, 64, 128]} />
            </mesh>

            {/* Solitaire Setting */}
            <group position={[0, 1.05, 0]}>
                {/* 6-Prong Crown */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <mesh key={i} position={[
                        Math.sin((i / 6) * Math.PI * 2) * 0.15,
                        0.1,
                        Math.cos((i / 6) * Math.PI * 2) * 0.15
                    ]} rotation={[0.2, (i / 6) * Math.PI * 2, 0]} material={goldMat}>
                        <cylinderGeometry args={[0.02, 0.015, 0.35, 8]} />
                    </mesh>
                ))}

                {/* The Diamond */}
                <mesh material={gemMat} position={[0, 0.2, 0]} castShadow>
                    <octahedronGeometry args={[0.35, 0]} />
                </mesh>

                {/* Glow Point */}
                <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#FFFFFF" distance={2} />
            </group>
        </group>
    );
};

// --- High Fidelity Necklace Model ---
const RealisticNecklace = ({ goldMat, gemMat }: any) => {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.5, 1.5, 0),
            new THREE.Vector3(-0.8, -1.2, 0.5),
            new THREE.Vector3(0, -1.8, 0.8),
            new THREE.Vector3(0.8, -1.2, 0.5),
            new THREE.Vector3(1.5, 1.5, 0)
        ]);
    }, []);

    return (
        <group>
            {/* The Chain */}
            <mesh material={goldMat} castShadow>
                <tubeGeometry args={[curve, 128, 0.05, 12, false]} />
            </mesh>

            {/* Pendant cluster */}
            <group position={[0, -1.85, 0.85]}>
                {/* Pendant Mounting */}
                <mesh material={goldMat}>
                    <cylinderGeometry args={[0.3, 0.35, 0.1, 8]} />
                </mesh>
                {/* Main Pendant Gem */}
                <mesh material={gemMat} position={[0, -0.15, 0.05]} rotation={[0, 0, Math.PI / 4]} castShadow>
                    <octahedronGeometry args={[0.4, 0]} />
                </mesh>
                {/* Luxury Detail - Halo gems */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <mesh key={i} position={[
                        Math.sin((i / 12) * Math.PI * 2) * 0.45,
                        0,
                        0
                    ]} material={gemMat} scale={0.15}>
                        <sphereGeometry args={[0.3, 16, 16]} />
                    </mesh>
                ))}
            </group>
        </group>
    );
};

// --- High Fidelity Bracelet Model ---
const RealisticBracelet = ({ goldMat, gemMat }: any) => {
    return (
        <group rotation={[Math.PI / 2, 0, 0.5]}>
            {/* The Bangle */}
            <mesh material={goldMat} castShadow>
                <torusGeometry args={[1.3, 0.18, 64, 128]} />
            </mesh>
            {/* Inlaid Gems */}
            {Array.from({ length: 16 }).map((_, i) => (
                <mesh key={i} position={[
                    Math.sin((i / 16) * Math.PI * 2) * 1.3,
                    Math.cos((i / 16) * Math.PI * 2) * 1.3,
                    0.15
                ]} material={gemMat} scale={0.1}>
                    <octahedronGeometry args={[0.5, 0]} />
                </mesh>
            ))}
        </group>
    );
};

export const Product3DViewer = ({ product }: Product3DViewerProps) => {
    const goldMat = useGoldMaterial(product.purity);
    const gemMat = useGemMaterial();

    const isRing = product.name.toLowerCase().includes('ring') || product.name.toLowerCase().includes('band');
    const isNecklace = product.name.toLowerCase().includes('necklace') || product.name.toLowerCase().includes('set');
    const isBracelet = product.name.toLowerCase().includes('bracelet') || product.name.toLowerCase().includes('bangle');

    return (
        <div className="w-full aspect-[4/5] bg-[#050505] rounded-xl overflow-hidden relative border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <span className="text-white/40 text-[10px] font-sans tracking-[0.3em] uppercase block mb-1">Interactive 3D</span>
                <h3 className="text-[#BF953F] text-xl font-serif">{product.name}</h3>
                <p className="text-white/60 text-xs font-light tracking-wide">{product.purity} Gold / Certified Purity</p>
            </div>

            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />

                {/* Lighting - Studio Setup */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <spotLight position={[-10, 5, 10]} angle={0.2} penumbra={1} intensity={1} color="#FFD700" />
                <pointLight position={[0, -5, 5]} intensity={0.5} color="#FFFFFF" />

                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        {isRing && <RealisticRing goldMat={goldMat} gemMat={gemMat} />}
                        {isNecklace && <RealisticNecklace goldMat={goldMat} gemMat={gemMat} />}
                        {isBracelet && <RealisticBracelet goldMat={goldMat} gemMat={gemMat} />}
                        {(!isRing && !isNecklace && !isBracelet) && <RealisticRing goldMat={goldMat} gemMat={gemMat} />}
                    </Float>

                    <Environment preset="apartment" />
                    <Sparkles count={50} scale={5} size={2} speed={0.4} color="#BF953F" opacity={0.4} />
                    <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.65} far={10} color="#000000" position={[0, -2.5, 0]} />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    autoRotate
                    autoRotateSpeed={1.5}
                    enableDamping
                    dampingFactor={0.05}
                />
            </Canvas>

            {/* Depth Hint */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                    <span className="text-white/30 text-[9px] uppercase tracking-[0.4em]">Drag to experience</span>
                </div>
            </div>
        </div>
    );
};

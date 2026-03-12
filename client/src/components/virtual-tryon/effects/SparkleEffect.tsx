import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const SparkleEffect = ({ active }: { active: boolean }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const [sparkleActive, setSparkleActive] = useState(false);

    useEffect(() => {
        if (active) {
            setSparkleActive(true);
            const timer = setTimeout(() => setSparkleActive(false), 800);
            return () => clearTimeout(timer);
        }
    }, [active]);

    useFrame((state) => {
        if (pointsRef.current && sparkleActive) {
            const time = state.clock.getElapsedTime();
            pointsRef.current.rotation.y = time * 2;
            pointsRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.2);
        }
    });

    if (!sparkleActive) return null;

    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#BF953F"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

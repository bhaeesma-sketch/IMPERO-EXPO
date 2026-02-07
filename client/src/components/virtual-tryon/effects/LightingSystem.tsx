import { Environment } from '@react-three/drei';

interface LightingSystemProps {
    intensity?: number;
    preset?: 'studio' | 'sunset' | 'dawn' | 'night' | 'warehouse';
}

export function LightingSystem({ intensity = 1, preset = 'studio' }: LightingSystemProps) {
    return (
        <>
            {/* Environment map for realistic reflections */}
            <Environment preset={preset} />

            {/* Key light - main illumination */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={intensity * 1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* Fill light - soften shadows */}
            <directionalLight
                position={[-3, 3, -3]}
                intensity={intensity * 0.5}
                color="#FFF5E1"
            />

            {/* Back light - rim lighting for depth */}
            <directionalLight
                position={[0, -5, -5]}
                intensity={intensity * 0.6}
                color="#E6F3FF"
            />

            {/* Ambient light - overall scene illumination */}
            <ambientLight intensity={intensity * 0.4} />

            {/* Hemisphere light - natural sky/ground lighting */}
            <hemisphereLight
                args={['#87CEEB', '#8B7355', intensity * 0.3]}
                position={[0, 10, 0]}
            />

            {/* Point lights for jewelry sparkle */}
            <pointLight position={[2, 2, 2]} intensity={intensity * 0.5} color="#FFFFFF" />
            <pointLight position={[-2, 2, 2]} intensity={intensity * 0.5} color="#FFFFFF" />
        </>
    );
}

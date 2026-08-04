"use client";
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShapes() {
  // Reduced from 20 to 8 for better desktop performance
  const count = 8;
  const shapes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      ] as [number, number, number],
      scale: Math.random() * 0.8 + 0.3,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      color: Math.random() > 0.5 ? '#8b5cf6' : '#d946ef'
    }));
  }, []);

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1} rotationIntensity={1} floatIntensity={1}>
          <Icosahedron args={[1, 0]} position={shape.position} scale={shape.scale} rotation={shape.rotation}>
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.5}
              wireframe
            />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

function Starfield() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;

      const targetX = (state.pointer.x * Math.PI) / 12;
      const targetY = (state.pointer.y * Math.PI) / 12;

      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.01;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Reduced from 4000 to 2000 stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      <FloatingShapes />
    </group>
  );
}

// Lightweight CSS-only background for mobile
function MobileBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Static gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0015] via-[#110025] to-[#0a0015]" />
      {/* Animated orbs using CSS only - GPU-friendly */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 -top-40 -right-40"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 bottom-0 -left-32"
        style={{
          background: 'radial-gradient(circle, #a21caf 0%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite 1s',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite 2s',
        }}
      />
      {/* Static dots grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}

export default function Scene() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect mobile: screen width < 768px OR touch device
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        ('ontouchstart' in window && window.innerWidth < 1024)
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  // On mobile → lightweight CSS background, no WebGL
  if (isMobile) {
    return <MobileBackground />;
  }

  // On desktop → full WebGL scene
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
        dpr={[1, 1.5]} // Limit pixel ratio to reduce GPU load
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
        <Starfield />
      </Canvas>
    </div>
  );
}



import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

export const Celestial3DScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Get theme color palette
    const getThemeColor = () => {
      switch (theme) {
        case 'cyberpunk':
          return { primary: 0x00f0ff, accent: 0xff1a8c, ambient: 0x090e24 };
        case 'oxford':
          return { primary: 0xb98616, accent: 0x994714, ambient: 0x2b1d14 };
        case 'emerald':
          return { primary: 0x1cd579, accent: 0x45d9a0, ambient: 0x082218 };
        case 'sunset':
          return { primary: 0xff3b81, accent: 0x7928ca, ambient: 0x150928 };
        case 'minimal':
          return { primary: 0x1d68f5, accent: 0x6366f1, ambient: 0x0a0f1d };
        case 'solar':
          return { primary: 0xf5be18, accent: 0xff7a00, ambient: 0x1b1308 };
        case 'midnight':
        default:
          return { primary: 0x8b5cf6, accent: 0x06b6d4, ambient: 0x0a1020 };
      }
    };

    const colors = getThemeColor();

    // Scene, Camera, Renderer
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for all celestial objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Core Geometric Polyhedron (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: colors.primary,
      emissive: colors.primary,
      emissiveIntensity: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner glowing core
    const innerGeo = new THREE.SphereGeometry(0.9, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colors.accent,
      transparent: true,
      opacity: 0.35,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Orbital Astrolabe Rings
    const createRing = (radius: number, tube: number, color: number, rotX: number, rotY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.3,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.rotation.y = rotY;
      return ringMesh;
    };

    const ring1 = createRing(2.3, 0.035, colors.primary, Math.PI / 3, Math.PI / 6);
    const ring2 = createRing(2.8, 0.03, colors.accent, -Math.PI / 4, Math.PI / 4);
    const ring3 = createRing(3.2, 0.025, colors.primary, Math.PI / 2, 0);
    mainGroup.add(ring1);
    mainGroup.add(ring2);
    mainGroup.add(ring3);

    // 3. Floating Stardust Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colors.accent,
      size: 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colors.primary, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colors.accent, 2.5, 20);
    pointLight2.position.set(-5, -5, -3);
    scene.add(pointLight2);

    // Responsive Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth dampening towards mouse position
      targetX += (mouseX * 0.75 - targetX) * 0.05;
      targetY += (mouseY * 0.75 - targetY) * 0.05;

      // Group rotation with mouse influence
      mainGroup.rotation.y = elapsedTime * 0.2 + targetX;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15 + targetY * 0.5;

      // Internal sub-rotations for independent organic movement
      coreMesh.rotation.x = elapsedTime * 0.35;
      coreMesh.rotation.y = elapsedTime * 0.45;
      innerMesh.rotation.y = -elapsedTime * 0.25;

      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.z = -elapsedTime * 0.3;
      ring3.rotation.y = elapsedTime * 0.2;

      particles.rotation.y = -elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      ring3.geometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[360px] sm:min-h-[440px] flex items-center justify-center pointer-events-none select-none ${className}`}
    />
  );
};

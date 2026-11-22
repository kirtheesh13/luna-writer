import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

export const Celestial3DScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Determine theme palette
    const isDark = theme !== 'oxford' && theme !== 'minimal';

    const getColors = () => {
      switch (theme) {
        case 'cyberpunk':
          return {
            cover: 0x0a1028,
            gold: 0x00f0ff,
            page: 0x111c3a,
            quill: 0xff1a8c,
            spark: 0x00f0ff,
            ambient: 0x00f0ff,
          };
        case 'oxford':
          return {
            cover: 0x3d2010,
            gold: 0xc69214,
            page: 0xf9f3e3,
            quill: 0x8a3b14,
            spark: 0xb98616,
            ambient: 0xffeedd,
          };
        case 'emerald':
          return {
            cover: 0x09261a,
            gold: 0x2ee59d,
            page: 0x0e3827,
            quill: 0x10b981,
            spark: 0x34d399,
            ambient: 0x10b981,
          };
        case 'sunset':
          return {
            cover: 0x200b33,
            gold: 0xff5376,
            page: 0x2e1245,
            quill: 0x7928ca,
            spark: 0xff3b81,
            ambient: 0xff7799,
          };
        case 'minimal':
          return {
            cover: 0x1a2238,
            gold: 0x2563eb,
            page: 0xffffff,
            quill: 0x3b82f6,
            spark: 0x60a5fa,
            ambient: 0x93c5fd,
          };
        case 'solar':
          return {
            cover: 0x241505,
            gold: 0xf59e0b,
            page: 0x331e08,
            quill: 0xd97706,
            spark: 0xfbbf24,
            ambient: 0xf59e0b,
          };
        case 'midnight':
        default:
          return {
            cover: 0x0e1328,
            gold: 0xc084fc,
            page: 0x161c38,
            quill: 0xa855f7,
            spark: 0x38bdf8,
            ambient: 0x818cf8,
          };
      }
    };

    const c = getColors();

    // Setup Dimensions
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Group
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);
    bookGroup.position.y = -0.3;

    // 2. Materials
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: c.cover,
      roughness: 0.45,
      metalness: 0.2,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: c.gold,
      roughness: 0.25,
      metalness: 0.85,
      emissive: c.gold,
      emissiveIntensity: 0.2,
    });

    const pageMaterial = new THREE.MeshStandardMaterial({
      color: c.page,
      roughness: 0.7,
      metalness: 0.05,
    });

    // 3. Left & Right Book Covers
    const coverGeo = new THREE.BoxGeometry(2.3, 0.12, 3.2);
    
    // Left Cover (rotated ~ -16 degrees)
    const leftCover = new THREE.Mesh(coverGeo, coverMaterial);
    leftCover.position.set(-1.18, 0, 0);
    leftCover.rotation.z = 0.14;
    leftCover.castShadow = true;
    leftCover.receiveShadow = true;
    bookGroup.add(leftCover);

    // Right Cover (rotated ~ +16 degrees)
    const rightCover = new THREE.Mesh(coverGeo, coverMaterial);
    rightCover.position.set(1.18, 0, 0);
    rightCover.rotation.z = -0.14;
    rightCover.castShadow = true;
    rightCover.receiveShadow = true;
    bookGroup.add(rightCover);

    // Spine
    const spineGeo = new THREE.CylinderGeometry(0.24, 0.24, 3.22, 20, 1, false, 0, Math.PI);
    const spine = new THREE.Mesh(spineGeo, coverMaterial);
    spine.rotation.x = Math.PI / 2;
    spine.rotation.z = Math.PI;
    spine.position.set(0, -0.06, 0);
    bookGroup.add(spine);

    // Spine Gold Ribs
    for (let i = -1.2; i <= 1.2; i += 0.6) {
      const ribGeo = new THREE.TorusGeometry(0.25, 0.02, 12, 24, Math.PI);
      const rib = new THREE.Mesh(ribGeo, goldMaterial);
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = Math.PI;
      rib.position.set(0, -0.06, i);
      bookGroup.add(rib);
    }

    // 4. Book Page Stacks
    const pageBlockGeo = new THREE.BoxGeometry(2.1, 0.28, 3.0);
    
    // Left Page Block
    const leftPages = new THREE.Mesh(pageBlockGeo, pageMaterial);
    leftPages.position.set(-1.12, 0.18, 0);
    leftPages.rotation.z = 0.12;
    leftPages.castShadow = true;
    bookGroup.add(leftPages);

    // Right Page Block
    const rightPages = new THREE.Mesh(pageBlockGeo, pageMaterial);
    rightPages.position.set(1.12, 0.18, 0);
    rightPages.rotation.z = -0.12;
    rightPages.castShadow = true;
    bookGroup.add(rightPages);

    // Gilded Golden Edges (Trim)
    const trimGeo = new THREE.BoxGeometry(0.04, 0.27, 3.0);
    const leftTrim = new THREE.Mesh(trimGeo, goldMaterial);
    leftTrim.position.set(-2.17, 0.18, 0);
    leftTrim.rotation.z = 0.12;
    bookGroup.add(leftTrim);

    const rightTrim = new THREE.Mesh(trimGeo, goldMaterial);
    rightTrim.position.set(2.17, 0.18, 0);
    rightTrim.rotation.z = -0.12;
    bookGroup.add(rightTrim);

    // 5. Curved Top Turning Pages (Creating layered book depth)
    const curvedPageGeo = new THREE.PlaneGeometry(2.0, 2.9, 16, 16);
    // Displace vertices to create elegant arch curve
    const pos = curvedPageGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) + 1.0) / 2.0; // 0 to 1
      const curve = Math.sin(u * Math.PI) * 0.12;
      pos.setZ(i, curve);
    }
    curvedPageGeo.computeVertexNormals();

    const topPageMat = new THREE.MeshStandardMaterial({
      color: c.page,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    const leftCurved = new THREE.Mesh(curvedPageGeo, topPageMat);
    leftCurved.rotation.x = -Math.PI / 2;
    leftCurved.rotation.y = 0.11;
    leftCurved.position.set(-1.08, 0.33, 0);
    bookGroup.add(leftCurved);

    const rightCurved = new THREE.Mesh(curvedPageGeo, topPageMat);
    rightCurved.rotation.x = -Math.PI / 2;
    rightCurved.rotation.y = -0.11;
    rightCurved.position.set(1.08, 0.33, 0);
    bookGroup.add(rightCurved);

    // 6. Glowing Celestial Moon Emblem on the Left Page
    const emblemGeo = new THREE.RingGeometry(0.35, 0.45, 32);
    const emblemMat = new THREE.MeshBasicMaterial({
      color: c.gold,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.rotation.x = -Math.PI / 2;
    emblem.rotation.y = 0.11;
    emblem.position.set(-1.08, 0.36, 0);
    bookGroup.add(emblem);

    const starGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const starMat = new THREE.MeshBasicMaterial({ color: c.gold });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.set(-1.08, 0.37, 0);
    bookGroup.add(star);

    // 7. Golden Silk Ribbon Bookmark
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.34, -1.5),
      new THREE.Vector3(0, 0.38, 0),
      new THREE.Vector3(0.25, 0.34, 1.3),
      new THREE.Vector3(0.4, 0.1, 1.8),
      new THREE.Vector3(0.5, -0.15, 2.1),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 32, 0.05, 8, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: c.gold,
      roughness: 0.3,
      metalness: 0.7,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    bookGroup.add(ribbon);

    // 8. The Floating Celestial Quill Pen (Hovering & Writing)
    const quillGroup = new THREE.Group();
    bookGroup.add(quillGroup);
    quillGroup.position.set(0.9, 1.3, 0.2);
    quillGroup.rotation.z = -Math.PI / 4.5;
    quillGroup.rotation.x = Math.PI / 8;

    // Golden Nib
    const nibGeo = new THREE.ConeGeometry(0.08, 0.35, 12);
    const nibMat = new THREE.MeshStandardMaterial({
      color: c.gold,
      metalness: 0.95,
      roughness: 0.15,
      emissive: c.gold,
      emissiveIntensity: 0.4,
    });
    const nib = new THREE.Mesh(nibGeo, nibMat);
    nib.rotation.x = Math.PI;
    nib.position.y = -0.18;
    quillGroup.add(nib);

    // Quill Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.7, 16);
    const barrel = new THREE.Mesh(barrelGeo, coverMaterial);
    barrel.position.y = 0.25;
    quillGroup.add(barrel);

    // Feather Vanes
    const featherGeo = new THREE.ConeGeometry(0.28, 1.6, 4);
    featherGeo.scale(0.18, 1, 1);
    const featherMat = new THREE.MeshStandardMaterial({
      color: c.quill,
      roughness: 0.5,
      metalness: 0.3,
      emissive: c.quill,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });
    const feather = new THREE.Mesh(featherGeo, featherMat);
    feather.position.y = 1.15;
    quillGroup.add(feather);

    // 9. Golden Lexicon Stardust Fountain (Rising particles)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; speed: number; phase: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 3.5;
      particlePositions[i * 3 + 1] = 0.3 + Math.random() * 3.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: 0.012 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.015,
        speed: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: c.spark,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    bookGroup.add(particleSystem);

    // 10. Atmospheric Celestial Astrolabe Orbit Ring
    const orbitRingGeo = new THREE.TorusGeometry(3.6, 0.025, 16, 100);
    const orbitRing = new THREE.Mesh(orbitRingGeo, goldMaterial);
    orbitRing.rotation.x = Math.PI / 2.3;
    orbitRing.position.y = 0.5;
    bookGroup.add(orbitRing);

    // 11. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    // Warm book spotlight
    const bookLight = new THREE.PointLight(c.gold, isDark ? 3.5 : 2.5, 12);
    bookLight.position.set(0, 3.5, 1.5);
    bookLight.castShadow = true;
    scene.add(bookLight);

    // Secondary fill light
    const fillLight = new THREE.PointLight(c.ambient, isDark ? 2.5 : 1.5, 10);
    fillLight.position.set(-3, 1, 3);
    scene.add(fillLight);

    // Responsive Mouse Tilt with Smooth Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      mouseX = x / (window.innerWidth / 2);
      mouseY = y / (window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera/book rotation tracking
      targetRotY += (mouseX * 0.45 - targetRotY) * 0.06;
      targetRotX += (-mouseY * 0.3 - targetRotX) * 0.06;

      // Gentle floating levitation of the entire book
      bookGroup.position.y = -0.3 + Math.sin(time * 1.4) * 0.08;
      bookGroup.rotation.y = targetRotY + Math.sin(time * 0.6) * 0.04;
      bookGroup.rotation.x = 0.35 + targetRotX + Math.cos(time * 0.8) * 0.03;

      // Quill writing motion (subtle cursive writing oscillation)
      quillGroup.position.x = 0.9 + Math.sin(time * 3.5) * 0.12;
      quillGroup.position.z = 0.2 + Math.cos(time * 2.8) * 0.14;
      quillGroup.position.y = 1.15 + Math.sin(time * 4.0) * 0.06;
      quillGroup.rotation.z = -Math.PI / 4.5 + Math.sin(time * 3.0) * 0.06;

      // Orbit Ring slow drift
      orbitRing.rotation.z = time * 0.18;

      // Update Rising Stardust
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const vel = particleVelocities[i];

        positions[idx] += Math.sin(time * vel.speed + vel.phase) * 0.005 + vel.x;
        positions[idx + 1] += vel.y;
        positions[idx + 2] += Math.cos(time * vel.speed + vel.phase) * 0.005 + vel.z;

        // Reset particle if it rises above threshold
        if (positions[idx + 1] > 3.8) {
          positions[idx + 1] = 0.3;
          positions[idx] = (Math.random() - 0.5) * 1.8;
          positions[idx + 2] = (Math.random() - 0.5) * 1.4;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse book glow light
      bookLight.intensity = (isDark ? 3.5 : 2.5) + Math.sin(time * 2.2) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      coverGeo.dispose();
      coverMaterial.dispose();
      spineGeo.dispose();
      pageBlockGeo.dispose();
      pageMaterial.dispose();
      goldMaterial.dispose();
      curvedPageGeo.dispose();
      topPageMat.dispose();
      emblemGeo.dispose();
      emblemMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      nibGeo.dispose();
      nibMat.dispose();
      barrelGeo.dispose();
      featherGeo.dispose();
      featherMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      orbitRingGeo.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center pointer-events-none select-none ${className}`}
    />
  );
};

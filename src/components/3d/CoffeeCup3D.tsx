import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Wind, Coffee, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type CupStyle = 'matte-black' | 'espresso-brown' | 'warm-cream' | 'terracotta';
export type CoffeeBlendType = 'espresso' | 'cappuccino' | 'latte' | 'mocha' | 'cold-brew';

interface CoffeeCup3DProps {
  onOrderCustomCup?: (blend: CoffeeBlendType, cupStyle: CupStyle) => void;
  className?: string;
}

export const CoffeeCup3D: React.FC<CoffeeCup3DProps> = ({ onOrderCustomCup, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cupGroupRef = useRef<THREE.Group | null>(null);
  const liquidMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cupMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const saucerMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const [activeBlend, setActiveBlend] = useState<CoffeeBlendType>('latte');
  const [activeCupColor, setActiveCupColor] = useState<CupStyle>('espresso-brown');
  const [isRotating, setIsRotating] = useState(true);
  const [steamEnabled, setSteamEnabled] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, products } = useApp();

  // Color mappings
  const cupColors: Record<CupStyle, { cup: number; roughness: number; metalness: number; label: string }> = {
    'espresso-brown': { cup: 0x3d2314, roughness: 0.35, metalness: 0.15, label: 'Espresso Brown' },
    'matte-black': { cup: 0x181412, roughness: 0.45, metalness: 0.25, label: 'Obsidian Black' },
    'warm-cream': { cup: 0xf5eedc, roughness: 0.25, metalness: 0.05, label: 'Porcelain Cream' },
    'terracotta': { cup: 0x8a4524, roughness: 0.4, metalness: 0.1, label: 'Bronze Terracotta' },
  };

  const blendDetails: Record<CoffeeBlendType, { name: string; desc: string; liquidColor: number; price: number }> = {
    'espresso': { name: 'Double Crema Espresso', desc: 'Dense hazelnut crema with dark roasted intensity', liquidColor: 0x221108, price: 4.75 },
    'cappuccino': { name: 'Velvet Cappuccino', desc: 'Silky microfoam mountain dusted with cinnamon', liquidColor: 0xd9ba9b, price: 5.75 },
    'latte': { name: 'Artisan Rosette Latte', desc: 'Steamed oat microfoam with handcrafted swan latte art', liquidColor: 0xcca076, price: 6.25 },
    'mocha': { name: 'Belgian Truffle Mocha', desc: 'Dark 72% chocolate ganache swirl with espresso', liquidColor: 0x3e2013, price: 6.50 },
    'cold-brew': { name: 'Nitro Cascading Cold Brew', desc: '24-hour slow dripped cold extraction over clear ice', liquidColor: 0x130d09, price: 5.95 },
  };

  // Generate procedural canvas texture for latte art
  const createLatteArtTexture = (blend: CoffeeBlendType): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const cx = 256;
    const cy = 256;

    if (blend === 'espresso') {
      // Golden crema with tiger striping
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 240);
      grad.addColorStop(0, '#5a2e17');
      grad.addColorStop(0.5, '#7b401e');
      grad.addColorStop(0.85, '#9e5a2c');
      grad.addColorStop(1, '#33170a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.fill();

      // Crema flecks
      ctx.fillStyle = 'rgba(235, 178, 107, 0.45)';
      for (let i = 0; i < 40; i++) {
        const rad = Math.random() * 200;
        const ang = Math.random() * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, Math.random() * 8 + 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (blend === 'latte') {
      // Latte base
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 240);
      grad.addColorStop(0, '#be9472');
      grad.addColorStop(0.7, '#8f5732');
      grad.addColorStop(1, '#4e2815');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.fill();

      // Handcrafted Latte Art Rosetta / Heart
      ctx.fillStyle = '#fdfbf7';
      ctx.shadowColor = 'rgba(80, 40, 15, 0.35)';
      ctx.shadowBlur = 10;

      // Heart center
      ctx.beginPath();
      ctx.moveTo(cx, cy - 20);
      ctx.bezierCurveTo(cx - 70, cy - 90, cx - 110, cy + 20, cx, cy + 90);
      ctx.bezierCurveTo(cx + 110, cy + 20, cx + 70, cy - 90, cx, cy - 20);
      ctx.fill();

      // Side leaves
      for (let i = 1; i <= 4; i++) {
        const yOffset = cy - 40 - i * 28;
        const scale = 1 - i * 0.16;
        ctx.beginPath();
        ctx.ellipse(cx - 35 * scale, yOffset, 30 * scale, 14 * scale, Math.PI / 5, 0, Math.PI * 2);
        ctx.ellipse(cx + 35 * scale, yOffset, 30 * scale, 14 * scale, -Math.PI / 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (blend === 'cappuccino') {
      // Fluffy foam with cocoa dusting
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 240);
      grad.addColorStop(0, '#f9f6f0');
      grad.addColorStop(0.7, '#ebd9c3');
      grad.addColorStop(0.9, '#9b643a');
      grad.addColorStop(1, '#421f10');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.fill();

      // Cinnamon / cocoa dusting in center swirl
      ctx.fillStyle = 'rgba(100, 48, 20, 0.6)';
      for (let i = 0; i < 90; i++) {
        const rad = Math.random() * 110;
        const ang = Math.random() * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, Math.random() * 4 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (blend === 'mocha') {
      // Swirled dark chocolate in golden foam
      const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 240);
      grad.addColorStop(0, '#e8cfba');
      grad.addColorStop(0.65, '#7c4323');
      grad.addColorStop(1, '#2c150b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.fill();

      // Chocolate syrup spiral
      ctx.strokeStyle = '#231008';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 6; a += 0.1) {
        const r = 20 + a * 11;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      // Cold Brew
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 240);
      grad.addColorStop(0, '#1c100b');
      grad.addColorStop(0.8, '#120a06');
      grad.addColorStop(1, '#050302');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.fill();

      // Ice reflections
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.roundRect(cx - 60, cy - 60, 50, 50, 8);
      ctx.roundRect(cx + 15, cy - 20, 60, 60, 8);
      ctx.roundRect(cx - 40, cy + 20, 55, 55, 8);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 6.5);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc89666, 1.8);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    const warmUnderLight = new THREE.PointLight(0xd97706, 1.2, 10);
    warmUnderLight.position.set(0, -1, 2);
    scene.add(warmUnderLight);

    // Master Group for Cup and Saucer
    const cupGroup = new THREE.Group();
    cupGroupRef.current = cupGroup;
    scene.add(cupGroup);

    // Initial Material for Cup
    const cupConfig = cupColors[activeCupColor];
    const cupMat = new THREE.MeshStandardMaterial({
      color: cupConfig.cup,
      roughness: cupConfig.roughness,
      metalness: cupConfig.metalness,
      bumpScale: 0.05
    });
    cupMaterialRef.current = cupMat;

    const saucerMat = new THREE.MeshStandardMaterial({
      color: cupConfig.cup,
      roughness: cupConfig.roughness,
      metalness: cupConfig.metalness,
    });
    saucerMaterialRef.current = saucerMat;

    // 1. Saucer Geometry
    const saucerPoints: THREE.Vector2[] = [];
    saucerPoints.push(new THREE.Vector2(0, 0));
    saucerPoints.push(new THREE.Vector2(1.8, 0.02));
    saucerPoints.push(new THREE.Vector2(2.6, 0.12));
    saucerPoints.push(new THREE.Vector2(2.9, 0.32));
    saucerPoints.push(new THREE.Vector2(2.82, 0.35));
    saucerPoints.push(new THREE.Vector2(2.5, 0.18));
    saucerPoints.push(new THREE.Vector2(1.2, 0.08));
    saucerPoints.push(new THREE.Vector2(0, 0.08));

    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 48);
    const saucerMesh = new THREE.Mesh(saucerGeo, saucerMat);
    saucerMesh.receiveShadow = true;
    cupGroup.add(saucerMesh);

    // 2. Cup Body Lathe Geometry (Realistic ceramic curve)
    const cupPoints: THREE.Vector2[] = [];
    cupPoints.push(new THREE.Vector2(0.9, 0.1));
    cupPoints.push(new THREE.Vector2(1.1, 0.2));
    cupPoints.push(new THREE.Vector2(1.35, 0.8));
    cupPoints.push(new THREE.Vector2(1.5, 1.6));
    cupPoints.push(new THREE.Vector2(1.55, 2.1));
    cupPoints.push(new THREE.Vector2(1.56, 2.15));
    cupPoints.push(new THREE.Vector2(1.5, 2.15)); // Rim outer
    cupPoints.push(new THREE.Vector2(1.44, 2.1)); // Rim inner
    cupPoints.push(new THREE.Vector2(1.38, 1.6));
    cupPoints.push(new THREE.Vector2(1.24, 0.8));
    cupPoints.push(new THREE.Vector2(0.98, 0.28));
    cupPoints.push(new THREE.Vector2(0, 0.28));

    const cupGeo = new THREE.LatheGeometry(cupPoints, 56);
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupGroup.add(cupMesh);

    // 3. Ergonomic Ceramic Handle
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(1.3, 1.85, 0),
      new THREE.Vector3(2.4, 1.75, 0),
      new THREE.Vector3(2.3, 0.75, 0),
      new THREE.Vector3(1.15, 0.65, 0)
    );
    const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.12, 16, false);
    const handleMesh = new THREE.Mesh(handleGeo, cupMat);
    handleMesh.castShadow = true;
    cupGroup.add(handleMesh);

    // 4. Coffee Liquid Disc with Latte Art Texture
    const liquidGeo = new THREE.CircleGeometry(1.42, 48);
    liquidGeo.rotateX(-Math.PI / 2);
    liquidGeo.translate(0, 1.96, 0);

    const liquidMat = new THREE.MeshStandardMaterial({
      map: createLatteArtTexture(activeBlend),
      roughness: 0.2,
      metalness: 0.1,
    });
    liquidMaterialRef.current = liquidMat;

    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    cupGroup.add(liquidMesh);

    // 5. Steam Particle System (3D rising curls)
    const particleCount = 45;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; phase: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.2;
      particlePositions[i * 3 + 1] = 2.0 + Math.random() * 2.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: 0.012 + Math.random() * 0.014,
        z: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom steam canvas texture for soft particle cloud
    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 64;
    steamCanvas.height = 64;
    const sCtx = steamCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255, 245, 235, 0.45)');
      grad.addColorStop(0.5, 'rgba(230, 215, 200, 0.25)');
      grad.addColorStop(1, 'rgba(200, 190, 180, 0)');
      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(32, 32, 30, 0, Math.PI * 2);
      sCtx.fill();
    }
    const steamTex = new THREE.CanvasTexture(steamCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.85,
      map: steamTex,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      opacity: 0.55,
    });

    const steamPoints = new THREE.Points(steamGeo, steamMat);
    steamParticlesRef.current = steamPoints;
    cupGroup.add(steamPoints);

    // Initial slight tilt for aesthetic display
    cupGroup.rotation.x = 0.15;
    cupGroup.rotation.y = 0.6;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous rotation
      if (isRotating && cupGroupRef.current && !isDraggingRef.current) {
        cupGroupRef.current.rotation.y += delta * 0.45;
      }

      // Gentle subtle breathing bob
      if (cupGroupRef.current) {
        cupGroupRef.current.position.y = Math.sin(time * 1.5) * 0.05;
      }

      // Animate Steam
      if (steamPoints && steamEnabled) {
        const posAttr = steamGeo.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          positions[i * 3 + 1] += v.y;
          positions[i * 3] += Math.sin(time * 2 + v.phase) * 0.005;
          positions[i * 3 + 2] += Math.cos(time * 1.8 + v.phase) * 0.005;

          // Recycle particle
          if (positions[i * 3 + 1] > 4.6) {
            positions[i * 3 + 1] = 2.0;
            positions[i * 3] = (Math.random() - 0.5) * 1.0;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse & Touch Drag Interaction
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cupGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cupGroupRef.current.rotation.y += deltaX * 0.01;
      cupGroupRef.current.rotation.x = Math.max(-0.2, Math.min(0.6, cupGroupRef.current.rotation.x + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !cupGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      cupGroupRef.current.rotation.y += deltaX * 0.012;
      cupGroupRef.current.rotation.x = Math.max(-0.2, Math.min(0.6, cupGroupRef.current.rotation.x + deltaY * 0.01));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Cup Color
  useEffect(() => {
    const config = cupColors[activeCupColor];
    if (cupMaterialRef.current && saucerMaterialRef.current) {
      cupMaterialRef.current.color.setHex(config.cup);
      cupMaterialRef.current.roughness = config.roughness;
      cupMaterialRef.current.metalness = config.metalness;

      saucerMaterialRef.current.color.setHex(config.cup);
      saucerMaterialRef.current.roughness = config.roughness;
      saucerMaterialRef.current.metalness = config.metalness;
    }
  }, [activeCupColor]);

  // Update Liquid Texture & Steam when blend changes
  useEffect(() => {
    if (liquidMaterialRef.current) {
      liquidMaterialRef.current.map = createLatteArtTexture(activeBlend);
      liquidMaterialRef.current.needsUpdate = true;
    }
    // Adjust steam for cold brew (cold drinks have no steam)
    if (steamParticlesRef.current) {
      steamParticlesRef.current.visible = steamEnabled && activeBlend !== 'cold-brew';
    }
  }, [activeBlend, steamEnabled]);

  const handleOrderCustomCup = () => {
    const blendInfo = blendDetails[activeBlend];
    const relatedProduct = products.find(p => p.name.toLowerCase().includes(activeBlend)) || products[1];

    addToCart(relatedProduct, {
      size: 'Medium',
      milk: activeBlend === 'latte' ? 'Oat Milk (Barista Edition)' : undefined,
      sugar: 'Standard Sweet',
      price: blendInfo.price
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);

    if (onOrderCustomCup) {
      onOrderCustomCup(activeBlend, activeCupColor);
    }
  };

  const handleResetAngle = () => {
    if (cupGroupRef.current) {
      cupGroupRef.current.rotation.set(0.15, 0.6, 0);
    }
  };

  return (
    <div id="coffee-3d-interactive-experience" className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#19120e] via-[#120d0a] to-[#0a0705] border border-amber-950/40 shadow-2xl p-4 sm:p-6 ${className}`}>
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-2 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Coffee className="w-4 h-4" />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">Interactive 3D Barista Lab</div>
            <h3 className="text-base sm:text-lg font-bold text-amber-100 font-serif">Spin, Customize & Brew</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-3d-toggle-steam"
            onClick={() => setSteamEnabled(!steamEnabled)}
            title={steamEnabled ? 'Disable Steam' : 'Enable Steam'}
            className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
              steamEnabled && activeBlend !== 'cold-brew'
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Steam</span>
          </button>

          <button
            id="btn-3d-toggle-rotate"
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause Auto Rotation' : 'Resume Auto Rotation'}
            className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
              isRotating
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Spin</span>
          </button>

          <button
            id="btn-3d-reset-view"
            onClick={handleResetAngle}
            title="Reset Angle"
            className="p-2 rounded-xl text-xs bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[370px] cursor-grab active:cursor-grabbing relative flex items-center justify-center select-none"
        title="Click and drag to rotate cup in 3D space"
      >
        <div className="absolute top-2 left-2 pointer-events-none text-[11px] text-amber-400/70 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs border border-amber-900/30 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Drag 360° to inspect roast & microfoam</span>
        </div>
      </div>

      {/* Control Bar: Blend Selector & Cup Glaze */}
      <div className="mt-2 space-y-3 z-10 relative">
        {/* Drink Blend Pills */}
        <div>
          <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
            Select Drink Blend & Microfoam Style
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {(Object.keys(blendDetails) as CoffeeBlendType[]).map((blendKey) => (
              <button
                key={blendKey}
                id={`btn-select-blend-${blendKey}`}
                onClick={() => setActiveBlend(blendKey)}
                className={`px-2 py-2 rounded-xl text-xs font-medium border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                  activeBlend === blendKey
                    ? 'bg-amber-600 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-900/40'
                    : 'bg-stone-900/70 text-stone-300 border-stone-800/80 hover:bg-stone-800'
                }`}
              >
                <span className="capitalize">{blendKey.replace('-', ' ')}</span>
                <span className={`text-[10px] ${activeBlend === blendKey ? 'text-stone-950/80' : 'text-amber-400/80'}`}>
                  ${blendDetails[blendKey].price.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cup Ceramic Colors & Order Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-950/40">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-medium text-stone-400 whitespace-nowrap">Ceramic Glaze:</span>
            <div className="flex items-center gap-2">
              {(Object.keys(cupColors) as CupStyle[]).map((cKey) => (
                <button
                  key={cKey}
                  id={`btn-cup-color-${cKey}`}
                  onClick={() => setActiveCupColor(cKey)}
                  title={cupColors[cKey].label}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    activeCupColor === cKey ? 'ring-2 ring-amber-400 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor:
                      cKey === 'espresso-brown' ? '#3d2314' :
                      cKey === 'matte-black' ? '#181412' :
                      cKey === 'warm-cream' ? '#f5eedc' : '#8a4524',
                    borderColor: activeCupColor === cKey ? '#fbbf24' : '#555'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            <div className="text-right">
              <div className="text-xs text-stone-400">Total Price</div>
              <div className="text-lg font-bold text-amber-400 font-serif">
                ${blendDetails[activeBlend].price.toFixed(2)}
              </div>
            </div>

            <button
              id="btn-order-3d-custom-cup"
              onClick={handleOrderCustomCup}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-amber-900/30'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Order This 3D Roast</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

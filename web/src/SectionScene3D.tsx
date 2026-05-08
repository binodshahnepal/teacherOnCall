import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SectionScene3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const light = new THREE.DirectionalLight(0xffffff, 2.2);
    light.position.set(3, 4, 5);
    scene.add(light);

    const root = new THREE.Group();
    scene.add(root);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x8de8ca,
      transparent: true,
      opacity: 0.24,
      roughness: 0.46,
      metalness: 0.08
    });
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2bd57,
      transparent: true,
      opacity: 0.28,
      roughness: 0.48
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x10231e,
      transparent: true,
      opacity: 0.14,
      roughness: 0.4
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.08, 16, 90), ringMaterial);
    torus.position.set(3.1, 1.05, -0.6);
    torus.rotation.set(0.8, 0.4, 0.2);
    root.add(torus);

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), darkMaterial);
    cube.position.set(-3.2, -0.2, -0.8);
    cube.rotation.set(0.4, 0.7, 0.2);
    root.add(cube);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 18), goldMaterial);
    sphere.position.set(2.1, -1.35, -0.2);
    root.add(sphere);

    const bars = new THREE.Group();
    for (let index = 0; index < 4; index += 1) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.62 + index * 0.18, 0.12),
        index % 2 ? ringMaterial : darkMaterial
      );
      bar.position.set(-1.2 + index * 0.3, -1.35 + index * 0.08, 0);
      bar.rotation.z = -0.18;
      bars.add(bar);
    }
    root.add(bars);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 320);
      const height = Math.max(mount.clientHeight, 220);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      if (!reduceMotion) {
        frame += 0.01;
        torus.rotation.z += 0.004;
        cube.rotation.x += 0.003;
        cube.rotation.y += 0.004;
        sphere.position.y = -1.35 + Math.sin(frame * 1.8) * 0.12;
        bars.rotation.y = Math.sin(frame) * 0.16;
      }
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, []);

  return <div className="section-scene-canvas" ref={mountRef} aria-hidden="true" />;
}

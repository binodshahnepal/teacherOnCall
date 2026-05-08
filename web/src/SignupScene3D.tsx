import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SignupScene3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 70);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const light = new THREE.DirectionalLight(0xffffff, 2.3);
    light.position.set(3, 4, 5);
    scene.add(light);

    const root = new THREE.Group();
    scene.add(root);

    const mint = new THREE.MeshStandardMaterial({
      color: 0x8de8ca,
      transparent: true,
      opacity: 0.72,
      roughness: 0.34,
      metalness: 0.08
    });
    const ink = new THREE.MeshStandardMaterial({
      color: 0x10231e,
      transparent: true,
      opacity: 0.58,
      roughness: 0.34,
      metalness: 0.06
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xf2bd57,
      transparent: true,
      opacity: 0.78,
      roughness: 0.38,
      metalness: 0.04
    });

    const profile = new THREE.Mesh(new THREE.BoxGeometry(1.78, 2.28, 0.12), mint);
    profile.position.set(-1.18, 0.04, 0.06);
    profile.rotation.set(0.08, -0.38, 0.04);
    root.add(profile);

    const profileInner = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.16, 0.08), ink);
    profileInner.position.set(-1.18, 0.46, 0.18);
    profileInner.rotation.copy(profile.rotation);
    root.add(profileInner);

    const profileLine = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.08), gold);
    profileLine.position.set(-1.18, -0.02, 0.2);
    profileLine.rotation.copy(profile.rotation);
    root.add(profileLine);

    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.12, 48), gold);
    badge.position.set(0.72, 0.92, 0.45);
    badge.rotation.set(1.3, 0.2, 0.1);
    root.add(badge);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.095, 14, 96), ink);
    ring.position.set(0.76, -0.34, -0.22);
    ring.rotation.set(0.7, 0.2, 0.4);
    root.add(ring);

    const nodes = new THREE.Group();
    const nodePositions = [
      new THREE.Vector3(-0.05, 1.38, 0.45),
      new THREE.Vector3(1.48, 0.48, 0.12),
      new THREE.Vector3(1.1, -1.08, 0.35),
      new THREE.Vector3(-0.52, -1.32, 0.18)
    ];
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0f6d55, transparent: true, opacity: 0.54 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([...nodePositions, nodePositions[0]]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    nodes.add(line);
    nodePositions.forEach((position, index) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(index === 1 ? 0.16 : 0.12, 28, 18), index % 2 ? gold : mint);
      node.position.copy(position);
      nodes.add(node);
    });
    root.add(nodes);

    const dots = new THREE.Group();
    for (let index = 0; index < 7; index += 1) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07 + index * 0.006, 18, 12), index % 2 ? mint : gold);
      dot.position.set(-2.2 + index * 0.62, -1.32 + Math.sin(index) * 0.22, Math.cos(index) * 0.22);
      dots.add(dot);
    }
    root.add(dots);
    root.scale.setScalar(1.28);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 220);
      const height = Math.max(mount.clientHeight, 180);
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
        root.rotation.y = Math.sin(frame * 0.8) * 0.14;
        profile.position.y = 0.08 + Math.sin(frame * 1.4) * 0.08;
        profileInner.position.y = 0.46 + Math.sin(frame * 1.4) * 0.08;
        profileLine.position.y = -0.02 + Math.sin(frame * 1.4) * 0.08;
        badge.rotation.z += 0.006;
        ring.rotation.z += 0.004;
        nodes.rotation.z = Math.sin(frame * 1.15) * 0.08;
        nodes.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.scale.setScalar(1 + Math.sin(frame * 2 + index) * 0.08);
          }
        });
        dots.children.forEach((dot, index) => {
          dot.position.y += Math.sin(frame + index) * 0.0008;
        });
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

  return <div className="signup-scene-canvas" ref={mountRef} aria-hidden="true" />;
}

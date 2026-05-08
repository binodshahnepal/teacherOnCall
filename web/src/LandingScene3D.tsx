import { useEffect, useRef } from "react";
import * as THREE from "three";

const subjects = ["Math", "IELTS", "Science", "SEE"];

function makeTextSprite(text: string, color: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const scale = window.devicePixelRatio || 1;
  canvas.width = 220 * scale;
  canvas.height = 82 * scale;
  context.scale(scale, scale);

  context.fillStyle = "rgba(255, 255, 255, 0.94)";
  roundRect(context, 8, 8, 204, 58, 12);
  context.fill();
  context.strokeStyle = "rgba(15, 109, 85, 0.18)";
  context.lineWidth = 2;
  roundRect(context, 8, 8, 204, 58, 12);
  context.stroke();

  context.fillStyle = color;
  context.font = "800 22px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 110, 38);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    })
  );
  sprite.scale.set(1.75, 0.65, 1);
  return sprite;
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

export function LandingScene3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.2, 8.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const mintLight = new THREE.PointLight(0x7ee7bf, 4.5, 12);
    mintLight.position.set(-3, 1.2, 3);
    scene.add(mintLight);

    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(4.9, 0.22, 2.1),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.48, metalness: 0.04 })
    );
    desk.position.set(0, -1.12, 0);
    desk.rotation.x = -0.08;
    root.add(desk);

    const laptop = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(2.65, 0.12, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xddebe6, roughness: 0.34, metalness: 0.12 })
    );
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(2.65, 1.62, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x10231e, roughness: 0.28, metalness: 0.08 })
    );
    base.position.set(0, -0.65, 0.18);
    screen.position.set(0, 0.16, -0.56);
    screen.rotation.x = -0.18;
    laptop.add(base, screen);
    laptop.rotation.y = -0.18;
    root.add(laptop);

    const card = new THREE.Mesh(
      new THREE.BoxGeometry(1.86, 1.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x8de8ca, roughness: 0.42, metalness: 0.02 })
    );
    card.position.set(1.78, 0.64, 0.72);
    card.rotation.set(-0.04, -0.38, 0.08);
    root.add(card);

    const bookMaterials = [0x0f6d55, 0xf2bd57, 0x4f8fb8].map(
      (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.02 })
    );
    const books = new THREE.Group();
    for (let index = 0; index < 3; index += 1) {
      const book = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.16, 0.72), bookMaterials[index]);
      book.position.set(-1.8, -0.86 + index * 0.18, 0.48 - index * 0.03);
      book.rotation.y = 0.18;
      books.add(book);
    }
    root.add(books);

    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 1.55, 18),
      new THREE.MeshStandardMaterial({ color: 0xf2bd57, roughness: 0.46 })
    );
    pencil.position.set(-0.6, -0.72, 1.02);
    pencil.rotation.set(1.25, 0.14, -0.86);
    root.add(pencil);

    const cap = new THREE.Group();
    const capTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.1, 1.25),
      new THREE.MeshStandardMaterial({ color: 0x17211d, roughness: 0.38 })
    );
    const capBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.44, 0.28, 32),
      new THREE.MeshStandardMaterial({ color: 0x253b34, roughness: 0.42 })
    );
    cap.add(capTop, capBand);
    cap.position.set(-1.2, 1.24, -0.28);
    cap.rotation.set(0.18, -0.54, 0.18);
    root.add(cap);

    subjects.forEach((subject, index) => {
      const sprite = makeTextSprite(subject, index % 2 === 0 ? "#0f6d55" : "#17211d");
      const angle = (index / subjects.length) * Math.PI * 2;
      sprite.position.set(Math.cos(angle) * 2.7, 0.88 + Math.sin(angle * 1.4) * 0.42, Math.sin(angle) * 0.7);
      root.add(sprite);
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 320);
      const height = Math.max(mount.clientHeight, 280);
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
      frame += 0.01;
      root.rotation.y += ((pointer.x * 0.12) - root.rotation.y) * 0.035;
      root.rotation.x += ((-pointer.y * 0.08) - root.rotation.x) * 0.035;

      if (!reduceMotion) {
        card.position.y = 0.64 + Math.sin(frame * 1.8) * 0.08;
        cap.rotation.z = 0.18 + Math.sin(frame * 1.4) * 0.05;
        books.rotation.y = Math.sin(frame * 1.2) * 0.045;
        root.children.forEach((child, index) => {
          if (child instanceof THREE.Sprite) {
            child.position.y += Math.sin(frame + index) * 0.0009;
          }
        });
      }

      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      mount.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
        if (object instanceof THREE.Sprite) {
          object.material.map?.dispose();
          object.material.dispose();
        }
      });
    };
  }, []);

  return <div className="landing-scene-canvas" ref={mountRef} aria-hidden="true" />;
}

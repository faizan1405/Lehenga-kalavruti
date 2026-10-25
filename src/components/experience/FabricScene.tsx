// Browser-only 3D "Garba Spin" scene: macro mirror work → fabric forms a flared skirt → full spin.
// Lazy-loaded from FabricHero — never import statically from SSR code.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import fabricUrl from "@/assets/l-mirror-macro.jpg";

export type SceneState = { p: number; mx: number; my: number };

const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Skirt({ state }: { state: React.MutableRefObject<SceneState> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const tex = useTexture(fabricUrl);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
  tex.repeat.set(3, 1.6);
  tex.anisotropy = 8;

  const W = 3, H = 3.2;
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H, 120, 90), []);
  const base = useMemo(() => Float32Array.from(geo.attributes["position"]!.array), [geo]);
  const { camera } = useThree();
  const tilt = useRef({ x: 0, y: 0 });
  const spinAngle = useRef(0);

  useFrame((s, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = s.clock.elapsedTime;
    const p = state.current.p;
    const form = sm(0.25, 0.48, p); // flat cloth → skirt
    const spin = sm(0.45, 0.8, p); // skirt opens while spinning
    const pos = geo.attributes["position"] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]!, y = base[i * 3 + 1]!;
      const v = (y + H / 2) / H; // 0 hem → 1 waist
      const flat = Math.sin(x * 2 + t * 0.5) * 0.08 + Math.sin(y * 1.7 + x + t * 0.3) * 0.06;
      const ang = (x / W) * Math.PI * 2;
      const hem = 1 - v;
      const r = 0.32 + hem * (0.75 + spin * 1.15) + Math.sin(ang * 12 + t * 0.8) * 0.03 * hem * (1 + spin);
      const lift = hem * hem * spin * 0.9;
      const fx = Math.sin(ang) * r, fz = Math.cos(ang) * r, fy = y * 0.85 + lift;
      pos.setXYZ(i, THREE.MathUtils.lerp(x, fx, form), THREE.MathUtils.lerp(y, fy, form), THREE.MathUtils.lerp(flat, fz, form));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const k = 1 - Math.exp(-3 * dt);
    tilt.current.x += (state.current.my * 0.06 - tilt.current.x) * k;
    tilt.current.y += (state.current.mx * 0.1 - tilt.current.y) * k;
    spinAngle.current = spin * Math.PI * 2.5 + sm(0.2, 0.45, p) * 0.6;
    if (mesh.current) {
      mesh.current.rotation.set(tilt.current.x + (1 - form) * -0.2, tilt.current.y + spinAngle.current, (1 - form) * 0.3);
    }
    if (light.current) light.current.position.set(state.current.mx * 3, 1 + state.current.my * 2, 2.5);

    let cz = THREE.MathUtils.lerp(0.5, 5.2, sm(0.02, 0.5, p));
    cz = THREE.MathUtils.lerp(cz, 3.2, sm(0.85, 1, p));
    camera.position.set(state.current.mx * 0.1, 0.2 + form * 0.3 + state.current.my * 0.05, cz);
    camera.lookAt(0, form * 0.1, 0);
  });

  return (
    <>
      <pointLight ref={light} intensity={6} distance={8} color="#ffd9a0" />
      <mesh ref={mesh} geometry={geo}>
        <meshPhysicalMaterial map={tex} roughness={0.55} metalness={0.15} clearcoat={0.4} clearcoatRoughness={0.3} sheen={1} sheenColor="#ffb3d1" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

export default function FabricScene({ state, active }: { state: React.MutableRefObject<SceneState>; active: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 0.5], fov: 40, near: 0.05 }}>
      <color attach="background" args={["#1c0c1d"]} />
      <fog attach="fog" args={["#1c0c1d", 5, 11]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={2} color="#ffe2b8" />
      <directionalLight position={[-4, 0, 2]} intensity={0.7} color="#d27ab5" />
      <Suspense fallback={null}>
        <Environment resolution={64}>
          <Lightformer intensity={1.8} color="#ffd6a3" position={[0, 4, 2]} scale={[8, 4, 1]} />
          <Lightformer intensity={0.8} color="#c54b8c" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        </Environment>
        <Skirt state={state} />
      </Suspense>
    </Canvas>
  );
}

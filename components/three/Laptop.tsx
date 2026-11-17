"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  createDeckTexture,
  createMonogramTexture,
  createScreenTexture,
} from "./textures";

// Positivo = la tapa cae hacia el teclado (pantalla hacia abajo).
const CLOSED_LID = (Math.PI / 2) * 0.975;
const OPEN_LID = -0.05;
const OPEN_DURATION = 2400;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function clamp01(x: number) {
  return Math.min(Math.max(x, 0), 1);
}

function useEnterProgress(entering: boolean) {
  const startedAt = useRef(0);
  useEffect(() => {
    if (entering) startedAt.current = performance.now();
  }, [entering]);
  return () => {
    if (!entering || !startedAt.current) return 0;
    return clamp01((performance.now() - startedAt.current) / OPEN_DURATION);
  };
}

export function Laptop({
  entering,
  offsetX,
}: {
  entering: boolean;
  offsetX: number;
}) {
  const lid = useRef<THREE.Group>(null);
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const screenLight = useRef<THREE.PointLight>(null);
  const group = useRef<THREE.Group>(null);
  const progress = useEnterProgress(entering);

  const screenTexture = useMemo(() => createScreenTexture(), []);
  const deckTexture = useMemo(() => createDeckTexture(), []);
  const monogramTexture = useMemo(() => createMonogramTexture(), []);

  useFrame((state, delta) => {
    const p = progress();
    const time = state.clock.elapsedTime;

    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.lerp(
        CLOSED_LID,
        OPEN_LID,
        easeOutCubic(clamp01(p / 0.62)),
      );
    }

    if (screenMaterial.current) {
      screenMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(
        0.05,
        1.65,
        clamp01((p - 0.15) / 0.55),
      );
    }

    if (screenLight.current) {
      screenLight.current.intensity = THREE.MathUtils.lerp(
        0.5,
        16,
        clamp01(p * 1.35),
      );
    }

    if (group.current) {
      const float = Math.sin(time * 0.85) * 0.015 * (1 - clamp01(p * 2));
      group.current.position.y = -0.42 + float;
      // Respiración sutil con el cursor (parallax de la malla)
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.pointer.x * 0.06 * (1 - clamp01(p * 2)),
        1 - Math.exp(-3 * delta),
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -state.pointer.y * 0.02 * (1 - clamp01(p * 2)),
        1 - Math.exp(-3 * delta),
      );
    }

  });

  return (
    <group ref={group} position={[offsetX, -0.42, 0]} scale={0.8}>
      {/* Base */}
      <RoundedBox args={[3.4, 0.16, 2.3]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color="#161b26" metalness={0.85} roughness={0.32} />
      </RoundedBox>

      {/* Teclado + trackpad (textura única) */}
      <mesh position={[0, 0.0815, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.06, 1.68]} />
        <meshStandardMaterial
          map={deckTexture}
          roughness={0.62}
          metalness={0.28}
        />
      </mesh>

      {/* Bisagra */}
      <mesh position={[0, 0.075, -1.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 20]} />
        <meshStandardMaterial color="#0a0d14" metalness={0.9} roughness={0.35} />
      </mesh>

      {/* Patas */}
      {[
        [-1.5, -0.085, 1.0],
        [1.5, -0.085, 1.0],
        [-1.5, -0.085, -1.0],
        [1.5, -0.085, -1.0],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
          <meshStandardMaterial color="#05070c" roughness={0.9} />
        </mesh>
      ))}

      {/* Tapa / pantalla */}
      <group ref={lid} position={[0, 0.08, -1.15]} rotation={[CLOSED_LID, 0, 0]}>
        <RoundedBox
          args={[3.4, 2.2, 0.1]}
          radius={0.055}
          smoothness={4}
          position={[0, 1.1, 0]}
        >
          <meshStandardMaterial color="#11151f" metalness={0.8} roughness={0.34} />
        </RoundedBox>

        {/* Bisel */}
        <mesh position={[0, 1.1, 0.053]}>
          <planeGeometry args={[3.26, 2.06]} />
          <meshStandardMaterial color="#04060c" roughness={0.55} />
        </mesh>

        {/* Pantalla */}
        <mesh position={[0, 1.1, 0.057]}>
          <planeGeometry args={[3.1, 1.9]} />
          <meshStandardMaterial
            ref={screenMaterial}
            map={screenTexture}
            emissiveMap={screenTexture}
            emissive="#cdefff"
            emissiveIntensity={0.05}
            roughness={0.28}
            metalness={0}
          />
        </mesh>

        {/* Luz que emite la pantalla hacia el teclado */}
        <pointLight
          ref={screenLight}
          position={[0, 1.05, 0.5]}
          color="#8fd8ff"
          intensity={0.5}
          distance={4.5}
          decay={2}
        />

        {/* Monograma en la cara exterior de la tapa (visible con el portátil cerrado) */}
        <mesh position={[0, 1.18, -0.056]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            map={monogramTexture}
            transparent
            opacity={0.95}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Filo luminoso frontal de la base */}
      <mesh position={[0, -0.03, 1.152]}>
        <boxGeometry args={[2.6, 0.008, 0.008]} />
        <meshBasicMaterial color="#1e9fd4" toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Rig({
  entering,
  offsetX,
}: {
  entering: boolean;
  offsetX: number;
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(offsetX, 1.02, 0));
  const progress = useEnterProgress(entering);

  const vectors = useMemo(
    () => ({
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      target: new THREE.Vector3(),
      lookStart: new THREE.Vector3(),
      lookEnd: new THREE.Vector3(),
      lookTarget: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const p = progress();
    const eased = easeInOutCubic(p);
    const pointerWeight = 1 - eased;

    vectors.start.set(
      offsetX * 0.12 + state.pointer.x * 0.24 * pointerWeight,
      1.85 + state.pointer.y * 0.08 * pointerWeight,
      7.0,
    );
    vectors.end.set(offsetX, 0.95, 1.1);

    vectors.lookStart.set(offsetX, 0.05, 0.12);
    vectors.lookEnd.set(offsetX, 0.72, -1.02);

    vectors.target.lerpVectors(vectors.start, vectors.end, eased);
    vectors.lookTarget.lerpVectors(vectors.lookStart, vectors.lookEnd, eased);

    const damping = 1 - Math.exp(-3.4 * delta);
    camera.position.lerp(vectors.target, damping);
    look.current.lerp(vectors.lookTarget, damping);
    camera.lookAt(look.current);
  });

  return null;
}

function Particles({ count = 180 }: { count?: number }) {
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 11;
      array[i * 3 + 1] = Math.random() * 4.2 - 0.3;
      array[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return array;
  }, [count]);

  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#6fe6ff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Floor() {
  return null;
}

export function Scene({ entering }: { entering: boolean }) {
  const { size } = useThree();
  const offsetX = size.width >= 1024 ? 1.0 : 0;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[3.5, 5.5, 4]}
        intensity={2.4}
        color="#d6e4ff"
      />
      <directionalLight
        position={[0, 2, 6]}
        intensity={1.1}
        color="#9ec9ff"
      />
      <pointLight
        position={[-3, 1.4, -1]}
        intensity={7}
        distance={9}
        color="#35e3ff"
      />
      <pointLight
        position={[3.6, 0.8, -2.2]}
        intensity={5}
        distance={9}
        color="#8b5cf6"
      />
      <pointLight
        position={[-2.6, 1.4, 2.2]}
        intensity={9}
        distance={8}
        color="#35e3ff"
      />
      <pointLight
        position={[3.2, 1.3, -1.8]}
        intensity={4.5}
        distance={9}
        color="#8b5cf6"
      />

      <pointLight
        position={[-1.6, 3, 2.2]}
        intensity={4}
        distance={11}
        color="#ffffff"
      />
      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#3d6eff"
          position={[-4, 3, 2]}
          scale={[6, 4, 1]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          color="#35e3ff"
          position={[4, 2, -1]}
          scale={[4, 3, 1]}
          rotation={[0, -Math.PI / 3, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.1}
          color="#8b5cf6"
          position={[0, 5, -3]}
          scale={3}
        />
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#ffffff"
          position={[0, 2.4, 5]}
          scale={[6, 3, 1]}
        />
      </Environment>

      <Laptop entering={entering} offsetX={offsetX} />
      <Particles />

      <ContactShadows
        position={[offsetX, -0.497, 0]}
        opacity={0.65}
        scale={8}
        blur={2.4}
        far={3}
        resolution={256}
        color="#000000"
      />

      <Rig entering={entering} offsetX={offsetX} />
    </>
  );
}

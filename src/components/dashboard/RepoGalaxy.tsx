'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useRepos } from '@/hooks/useGitHub';
import type { GitHubRepo } from '@/lib/github';
import { languageColor } from '@/lib/language-colors';

type Vec3 = [number, number, number];

interface Node {
  repo: GitHubRepo;
  position: Vec3;
  radius: number;
  color: string;
}

/** Evenly spaced cluster centers on a sphere (fibonacci distribution). */
function clusterCenter(i: number, n: number, R: number): Vec3 {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
  return [
    R * Math.cos(theta) * Math.sin(phi),
    R * Math.sin(theta) * Math.sin(phi),
    R * Math.cos(phi),
  ];
}

/** Deterministic per-repo jitter so the layout is stable across renders. */
function jitter(seed: number): Vec3 {
  const r = (s: number) => {
    const x = Math.sin(s) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  return [r(seed) * 4, r(seed * 1.7) * 4, r(seed * 2.3) * 4];
}

function buildNodes(repos: GitHubRepo[]): Node[] {
  const list = repos
    .filter((r) => !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 120);

  const langs = [...new Set(list.map((r) => r.language ?? 'Other'))];
  const centers = new Map<string, Vec3>(
    langs.map((l, i) => [l, clusterCenter(i, langs.length, 18)]),
  );

  return list.map((repo) => {
    const c = centers.get(repo.language ?? 'Other')!;
    const j = jitter(repo.id);
    return {
      repo,
      position: [c[0] + j[0], c[1] + j[1], c[2] + j[2]],
      radius: Math.min(1.4, 0.3 + Math.log1p(repo.stargazers_count) * 0.14),
      color: repo.language ? languageColor(repo.language) : '#6b7280',
    };
  });
}

function RepoNode({
  node,
  onHover,
  onSelect,
}: {
  node: Node;
  onHover: (n: Node | null) => void;
  onSelect: (repo: GitHubRepo) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(node);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.repo);
      }}
    >
      <sphereGeometry args={[node.radius, 24, 24]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={hovered ? 0.9 : 0.3}
        roughness={0.35}
        metalness={0.1}
      />
    </mesh>
  );
}

function Scene({
  repos,
  reduce,
  onSelect,
}: {
  repos: GitHubRepo[];
  reduce: boolean;
  onSelect: (repo: GitHubRepo) => void;
}) {
  const nodes = useMemo(() => buildNodes(repos), [repos]);
  const [hovered, setHovered] = useState<Node | null>(null);

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[20, 20, 20]} intensity={1.3} />
      <Stars
        radius={120}
        depth={60}
        count={2500}
        factor={4}
        fade
        speed={reduce ? 0 : 1}
      />
      {nodes.map((n) => (
        <RepoNode
          key={n.repo.id}
          node={n}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}
      {hovered && (
        <Html position={hovered.position} center distanceFactor={26}>
          <div className="pointer-events-none -translate-y-8 whitespace-nowrap rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md">
            <span className="font-medium">{hovered.repo.name}</span>
            <span className="text-muted-foreground">
              {' '}
              · ★ {hovered.repo.stargazers_count}
              {hovered.repo.language ? ` · ${hovered.repo.language}` : ''}
            </span>
          </div>
        </Html>
      )}
      <OrbitControls
        enablePan={false}
        enableDamping
        autoRotate={!reduce}
        autoRotateSpeed={0.35}
        minDistance={8}
        maxDistance={70}
      />
    </>
  );
}

export default function RepoGalaxy() {
  const { data: repos } = useRepos();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  if (!repos) {
    return (
      <div className="flex size-full items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 42], fov: 50 }}>
      <color attach="background" args={['#05060a']} />
      <Scene
        repos={repos}
        reduce={reduce}
        onSelect={(repo) => router.push(`/repos/${repo.full_name}`)}
      />
    </Canvas>
  );
}

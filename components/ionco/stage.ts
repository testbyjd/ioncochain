/**
 * IONCO story stage: a single WebGL scene that sits behind the homepage and
 * rearranges a field of glowing blocks as the reader scrolls. Loaded lazily on
 * the client; nothing here runs on the server.
 */
import * as THREE from "three";

export const CHAPTER_COUNT = 6;

export type StageHandle = {
  /** Continuous chapter position, 0 … CHAPTER_COUNT - 1. */
  setProgress(p: number): void;
  /** Pointer in normalised device units, -1 … 1 on each axis. */
  setPointer(x: number, y: number): void;
  setReducedMotion(reduced: boolean): void;
  dispose(): void;
};

type Layout = "wide" | "portrait";

type Formation = {
  cam: THREE.Vector3;
  look: THREE.Vector3;
  grid: number;
  animate(
    time: number,
    pos: Float32Array,
    quat: Float32Array,
    scale: Float32Array,
    glow: Float32Array,
  ): void;
};

const EDGE = new THREE.Color("#64e5e4");
const FACE = new THREE.Color("#07171a");
const GRID = new THREE.Color("#2fb7b9");

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

const tmpQ = new THREE.Quaternion();
const tmpQ2 = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpV = new THREE.Vector3();

function writeQuat(out: Float32Array, i: number, q: THREE.Quaternion) {
  out[i * 4] = q.x;
  out[i * 4 + 1] = q.y;
  out[i * 4 + 2] = q.z;
  out[i * 4 + 3] = q.w;
}

function writeVec(out: Float32Array, i: number, v: THREE.Vector3) {
  out[i * 3] = v.x;
  out[i * 3 + 1] = v.y;
  out[i * 3 + 2] = v.z;
}

/* ------------------------------------------------------------------------ */
/* Formations                                                                */
/* ------------------------------------------------------------------------ */

/** 00 · Hero. A dense core with three rings of blocks in orbit around it. */
function orbit(n: number, layout: Layout): Formation {
  const r = rng(11);
  const coreCount = Math.round(n * 0.16);
  const ringCount = n - coreCount;
  const local = new Float32Array(n * 3);
  const angle = new Float32Array(n);
  const radius = new Float32Array(n);
  const height = new Float32Array(n);
  const size = new Float32Array(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    if (i < coreCount) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / coreCount);
      const theta = golden * i;
      const rad = 1.25 + r() * 0.5;
      local[i * 3] = Math.cos(theta) * Math.sin(phi) * rad;
      local[i * 3 + 1] = Math.cos(phi) * rad;
      local[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * rad;
      size[i] = 0.26 + r() * 0.22;
    } else {
      const j = i - coreCount;
      const ring = j % 3;
      const per = Math.ceil(ringCount / 3);
      angle[i] =
        (Math.floor(j / 3) / per) * Math.PI * 2 + ring * 0.7 + (r() - 0.5) * 0.1;
      radius[i] = 5.4 + ring * 1.1 + (r() - 0.5) * 0.5;
      height[i] = (r() - 0.5) * 0.8;
      size[i] = 0.28 + r() * 0.42;
    }
  }
  const tilt = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      THREE.MathUtils.degToRad(66),
      0,
      THREE.MathUtils.degToRad(-10),
    ),
  );
  const center =
    layout === "wide"
      ? new THREE.Vector3(0, -1.1, 0)
      : new THREE.Vector3(0, 0.2, 0);
  return {
    cam:
      layout === "wide"
        ? new THREE.Vector3(0, 1.4, 20)
        : new THREE.Vector3(0, 2.4, 34),
    look: center.clone().add(new THREE.Vector3(0, 0.4, 0)),
    grid: 0,
    animate(time, pos, quat, scale, glow) {
      const spin = time * 0.11;
      const coreSpin = -time * 0.25;
      const wobble = Math.sin(time * 0.35) * 0.06;
      tmpQ2.setFromEuler(tmpE.set(wobble, 0, 0)).multiply(tilt);
      for (let i = 0; i < n; i++) {
        if (i < coreCount) {
          tmpV
            .set(local[i * 3], local[i * 3 + 1], local[i * 3 + 2])
            .applyAxisAngle(THREE.Object3D.DEFAULT_UP, coreSpin);
          tmpQ.setFromEuler(tmpE.set(coreSpin * 0.5, coreSpin, 0));
          glow[i] = 0.4 + 0.4 * (0.5 + 0.5 * Math.sin(time * 2.1 + i * 0.37));
        } else {
          const a = angle[i] + spin;
          tmpV.set(
            Math.cos(a) * radius[i],
            height[i],
            Math.sin(a) * radius[i],
          );
          tmpQ.setFromEuler(tmpE.set(0, -a, 0));
          glow[i] = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(a * 5 + time * 1.4));
        }
        tmpV.applyQuaternion(tmpQ2).add(center);
        tmpQ.premultiply(tmpQ2);
        writeVec(pos, i, tmpV);
        writeQuat(quat, i, tmpQ);
        scale[i] = size[i];
      }
    },
  };
}

/** 01 · The chain. Straight lanes of blocks receding to the horizon. */
function lanes(n: number, layout: Layout): Formation {
  const laneCount = layout === "wide" ? 5 : 3;
  const per = Math.ceil(n / laneCount);
  const gap = 1.5;
  const laneGap = layout === "wide" ? 3.8 : 3.4;
  const length = per * gap;
  const base = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const lane = i % laneCount;
    const k = Math.floor(i / laneCount);
    base[i * 3] = (lane - (laneCount - 1) / 2) * laneGap;
    base[i * 3 + 1] = 0;
    base[i * 3 + 2] = 5 - k * gap;
  }
  const identity = new THREE.Quaternion();
  return {
    cam:
      layout === "wide"
        ? new THREE.Vector3(0, 4.6, 15)
        : new THREE.Vector3(0, 6.5, 23),
    look: new THREE.Vector3(0, -0.6, -24),
    grid: 0.34,
    animate(time, pos, quat, scale, glow) {
      pos.set(base);
      for (let i = 0; i < n; i++) {
        const z = base[i * 3 + 2];
        let g = 0.12;
        for (let p = 0; p < 3; p++) {
          const u = (time * 0.09 + p / 3) % 1;
          const pz = 5 - u * (length + 10);
          const d = z - pz;
          g = Math.max(g, Math.exp(-(d * d) / 7));
        }
        glow[i] = g;
        writeQuat(quat, i, identity);
        scale[i] = 0.92;
      }
    },
  };
}

/** 02 · INC. A hex-packed coin, three layers thick, with satellites. */
function coin(n: number, layout: Layout): Formation {
  const r = rng(29);
  const spacing = 0.98;
  const cells: Array<[number, number, number]> = [];
  for (let q = -9; q <= 9; q++)
    for (let s = -9; s <= 9; s++) {
      const x = spacing * (q + s / 2);
      const z = spacing * s * 0.866;
      cells.push([x, z, Math.hypot(x, z)]);
    }
  cells.sort((a, b) => a[2] - b[2]);
  const layers = 3;
  const discCount = Math.min(n, Math.floor(n * 0.7));
  const perLayer = Math.floor(discCount / layers);
  const local = new Float32Array(n * 3);
  const rad = new Float32Array(n);
  const size = new Float32Array(n);
  const satAngle = new Float32Array(n);
  let i = 0;
  for (let layer = 0; layer < layers; layer++)
    for (let c = 0; c < perLayer; c++, i++) {
      const [x, z, d] = cells[c];
      local[i * 3] = x;
      local[i * 3 + 1] = (layer - (layers - 1) / 2) * 0.94;
      local[i * 3 + 2] = z;
      rad[i] = d;
      size[i] = 0.7;
    }
  for (; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = 7.4 + r() * 3.2;
    satAngle[i] = a;
    local[i * 3] = Math.cos(a) * d;
    local[i * 3 + 1] = (r() - 0.5) * 1.6;
    local[i * 3 + 2] = Math.sin(a) * d;
    rad[i] = d;
    size[i] = 0.18 + r() * 0.3;
  }
  const center =
    layout === "wide"
      ? new THREE.Vector3(6.4, 0.6, -6)
      : new THREE.Vector3(0, 4.6, -6);
  return {
    cam:
      layout === "wide"
        ? new THREE.Vector3(0, 1.6, 27)
        : new THREE.Vector3(0, 2.4, 36),
    look: layout === "wide" ? new THREE.Vector3(1.8, 0.4, -6) : center.clone(),
    grid: 0,
    animate(time, pos, quat, scale, glow) {
      const spin = time * 0.22;
      const tiltAngle = THREE.MathUtils.degToRad(58 + Math.sin(time * 0.4) * 7);
      tmpQ2.setFromEuler(tmpE.set(tiltAngle, 0, THREE.MathUtils.degToRad(-14)));
      for (let k = 0; k < n; k++) {
        tmpV
          .set(local[k * 3], local[k * 3 + 1], local[k * 3 + 2])
          .applyAxisAngle(THREE.Object3D.DEFAULT_UP, spin)
          .applyQuaternion(tmpQ2)
          .add(center);
        tmpQ.setFromEuler(tmpE.set(0, spin, 0)).premultiply(tmpQ2);
        writeVec(pos, k, tmpV);
        writeQuat(quat, k, tmpQ);
        scale[k] = size[k];
        glow[k] =
          0.18 + 0.55 * (0.5 + 0.5 * Math.sin(time * 2.4 - rad[k] * 1.15));
      }
    },
  };
}

/** 03 · The app. A curved wall of blocks, breathing in depth. */
function wall(n: number, layout: Layout): Formation {
  const r = rng(47);
  const cols = layout === "wide" ? 26 : 12;
  const rows = Math.ceil(n / cols);
  const sp = 1.42;
  const cx = layout === "wide" ? 3.4 : 0;
  const cy = layout === "wide" ? 0 : 2.6;
  const base = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const row = Math.floor(i / cols);
    const x = (c - (cols - 1) / 2) * sp + cx;
    const y = (row - (rows - 1) / 2) * sp + cy;
    base[i * 3] = x;
    base[i * 3 + 1] = y;
    base[i * 3 + 2] = -7 - (x - cx) * (x - cx) * 0.055 - (r() - 0.5) * 0.6;
    seed[i] = r();
  }
  const identity = new THREE.Quaternion();
  return {
    cam:
      layout === "wide"
        ? new THREE.Vector3(0, 0.2, 19)
        : new THREE.Vector3(0, 1.8, 24),
    look: new THREE.Vector3(0, 0.3, -7),
    grid: 0,
    animate(time, pos, quat, scale, glow) {
      for (let i = 0; i < n; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] =
          base[i * 3 + 2] + Math.sin(x * 0.5 + time * 0.9) * 0.45 + Math.cos(y * 0.6 + time * 0.7) * 0.3;
        writeQuat(quat, i, identity);
        scale[i] = 0.6;
        const tw = 0.5 + 0.5 * Math.sin(time * 1.3 + seed[i] * 60);
        glow[i] = 0.1 + Math.pow(tw, 9) * 0.9;
      }
    },
  };
}

/** 04 · The journey. A rising helix with three milestone blocks. */
function helix(n: number, layout: Layout): Formation {
  const turns = 3;
  const radius = layout === "wide" ? 5.2 : 4.2;
  const heightSpan = layout === "wide" ? 13 : 15;
  const cx = layout === "wide" ? 4.6 : 0;
  const cy = layout === "wide" ? 0 : 2.5;
  const milestones = [0.14, 0.5, 0.86];
  const isMilestone = new Uint8Array(n);
  milestones.forEach((u) => (isMilestone[Math.round(u * (n - 1))] = 1));
  return {
    cam:
      layout === "wide"
        ? new THREE.Vector3(0, 1.2, 21)
        : new THREE.Vector3(0, 2.4, 30),
    look: new THREE.Vector3(layout === "wide" ? 1.2 : 0, cy, 0),
    grid: 0.1,
    animate(time, pos, quat, scale, glow) {
      const spin = time * 0.16;
      const head = (time * 0.075) % 1.25;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const a = u * Math.PI * 2 * turns + spin;
        tmpV.set(
          Math.cos(a) * radius + cx,
          (u - 0.5) * heightSpan + cy,
          Math.sin(a) * radius,
        );
        tmpQ.setFromEuler(tmpE.set(0, -a, THREE.MathUtils.degToRad(18)));
        writeVec(pos, i, tmpV);
        writeQuat(quat, i, tmpQ);
        const d = u - head;
        const pulse = Math.exp(-(d * d) / 0.0012);
        scale[i] = isMilestone[i] ? 1.15 : 0.3;
        glow[i] = isMilestone[i]
          ? 0.75 + 0.25 * Math.sin(time * 3)
          : 0.12 + pulse * 0.9;
      }
    },
  };
}

/** 05 · The next chapter. An endless field flowing toward the camera. */
function field(n: number, layout: Layout): Formation {
  const r = rng(83);
  const cols = layout === "wide" ? 16 : 9;
  const rows = Math.ceil(n / cols);
  const sx = 2.9;
  const sz = 3.3;
  const length = rows * sz;
  const base = new Float32Array(n * 3);
  const identity = new THREE.Quaternion();
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const row = Math.floor(i / cols);
    base[i * 3] = (c - (cols - 1) / 2) * sx + (r() - 0.5) * 1.1;
    base[i * 3 + 1] = -2.3 + (r() - 0.5) * 0.4;
    base[i * 3 + 2] = row * sz + r() * 0.8;
  }
  return {
    cam:
      layout === "wide"
        ? new THREE.Vector3(0, 1.7, 10)
        : new THREE.Vector3(0, 2.4, 12),
    look: new THREE.Vector3(0, -0.4, -30),
    grid: 0.42,
    animate(time, pos, quat, scale, glow) {
      const travel = time * 3.1;
      for (let i = 0; i < n; i++) {
        const d = (((base[i * 3 + 2] - travel) % length) + length) % length;
        const z = 9 - d;
        pos[i * 3] = base[i * 3];
        pos[i * 3 + 1] = base[i * 3 + 1];
        pos[i * 3 + 2] = z;
        writeQuat(quat, i, identity);
        scale[i] = 0.7;
        const band = 0.5 + 0.5 * Math.sin(z * 0.28 + time * 2.2);
        glow[i] = 0.12 + Math.pow(band, 6) * 0.75;
      }
    },
  };
}

const BUILDERS = [orbit, lanes, coin, wall, helix, field];

/* ------------------------------------------------------------------------ */
/* Materials                                                                 */
/* ------------------------------------------------------------------------ */

const blockVertex = /* glsl */ `
  attribute float aGlow;
  varying vec2 vUv;
  varying float vGlow;
  varying float vDepth;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vGlow = aGlow;
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    vNormal = normalize(mat3(instanceMatrix) * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const blockFragment = /* glsl */ `
  uniform vec3 uEdge;
  uniform vec3 uFace;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vUv;
  varying float vGlow;
  varying float vDepth;
  varying vec3 vNormal;
  void main() {
    vec2 d2 = min(vUv, 1.0 - vUv);
    float d = min(d2.x, d2.y);
    float w = fwidth(d) * 1.1 + 0.014;
    float line = 1.0 - smoothstep(0.0, w + 0.018, d);
    float halo = exp(-d * 13.0) * 0.5;
    float light = 0.5 + 0.5 * max(0.0, dot(normalize(vNormal), normalize(vec3(0.35, 0.85, 0.4))));
    float g = clamp(vGlow, 0.0, 1.0);
    vec3 edge = mix(uEdge, vec3(1.0), g * 0.55);
    float strength = (line + halo) * (0.7 + 1.1 * g);
    vec3 color = uFace * light + edge * strength + uEdge * g * 0.16;
    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    gl_FragColor = vec4(color, 1.0 - fog);
  }
`;

const gridVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const gridFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCam;
  uniform float uOpacity;
  varying vec3 vWorld;
  void main() {
    vec2 cell = vWorld.xz / 3.2;
    vec2 g = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float dist = distance(vWorld.xz, uCam.xz);
    float fade = 1.0 - smoothstep(6.0, 62.0, dist);
    gl_FragColor = vec4(uColor, line * fade * uOpacity);
  }
`;

function spriteTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(160,255,250,0.55)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(c);
  texture.needsUpdate = true;
  return texture;
}

/* ------------------------------------------------------------------------ */
/* Stage                                                                     */
/* ------------------------------------------------------------------------ */

export function createStage(
  canvas: HTMLCanvasElement,
  options: { reducedMotion: boolean },
): StageHandle {
  THREE.ColorManagement.enabled = false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const count = coarse || window.innerWidth < 768 ? 260 : 460;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 16, 64);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 160);

  /* Blocks */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const glowAttr = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
  glowAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("aGlow", glowAttr);
  const material = new THREE.ShaderMaterial({
    vertexShader: blockVertex,
    fragmentShader: blockFragment,
    uniforms: {
      uEdge: { value: EDGE },
      uFace: { value: FACE },
      uFogNear: { value: 14 },
      uFogFar: { value: 60 },
    },
    transparent: true,
  });
  const blocks = new THREE.InstancedMesh(geometry, material, count);
  blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  blocks.frustumCulled = false;
  scene.add(blocks);

  /* Soft glow sprites at every block centre */
  const glowGeometry = new THREE.BufferGeometry();
  const glowPositions = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  glowPositions.setUsage(THREE.DynamicDrawUsage);
  glowGeometry.setAttribute("position", glowPositions);
  const glowMaterial = new THREE.PointsMaterial({
    map: spriteTexture(),
    color: EDGE,
    size: 1.9,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const glows = new THREE.Points(glowGeometry, glowMaterial);
  glows.frustumCulled = false;
  scene.add(glows);

  /* Dust */
  const dustCount = coarse ? 380 : 800;
  const dust = new Float32Array(dustCount * 3);
  const dr = rng(5);
  for (let i = 0; i < dustCount; i++) {
    dust[i * 3] = (dr() - 0.5) * 90;
    dust[i * 3 + 1] = -9 + dr() * 26;
    dust[i * 3 + 2] = -80 + dr() * 96;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPoints = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      color: EDGE,
      size: 0.07,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  dustPoints.frustumCulled = false;
  scene.add(dustPoints);

  /* Ground grid */
  const gridMaterial = new THREE.ShaderMaterial({
    vertexShader: gridVertex,
    fragmentShader: gridFragment,
    uniforms: {
      uColor: { value: GRID },
      uCam: { value: new THREE.Vector3() },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
  });
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), gridMaterial);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -2.9;
  grid.frustumCulled = false;
  scene.add(grid);

  /* Buffers */
  const posA = new Float32Array(count * 3);
  const posB = new Float32Array(count * 3);
  const quatA = new Float32Array(count * 4);
  const quatB = new Float32Array(count * 4);
  const scaleA = new Float32Array(count);
  const scaleB = new Float32Array(count);
  const glowA = new Float32Array(count);
  const glowB = new Float32Array(count);
  const seed = new Float32Array(count);
  const sr = rng(3);
  for (let i = 0; i < count; i++) seed[i] = sr();

  let layout: Layout = "wide";
  let formations: Formation[] = [];
  const build = () => {
    formations = BUILDERS.map((make) => make(count, layout));
  };

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nextLayout: Layout = width / height < 0.9 ? "portrait" : "wide";
    if (nextLayout !== layout || formations.length === 0) {
      layout = nextLayout;
      build();
    }
    const budget = Math.sqrt(4.4e6 / Math.max(1, width * height));
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2, Math.max(1, budget)),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  /* State */
  let target = 0;
  let progress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let reduced = options.reducedMotion;
  let time = 0;
  let last = performance.now();
  let raf = 0;
  let disposed = false;

  const matrix = new THREE.Matrix4();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();

  const update = () => {
    const max = formations.length - 1;
    const clamped = Math.min(max, Math.max(0, progress));
    const i0 = Math.min(max, Math.floor(clamped));
    const i1 = Math.min(max, i0 + 1);
    const t = ease(clamped - i0);
    const a = formations[i0];
    const b = formations[i1];
    const blending = i1 !== i0 && t > 0.0005;

    a.animate(time, posA, quatA, scaleA, glowA);
    if (blending) b.animate(time, posB, quatB, scaleB, glowB);

    const glowArray = glowAttr.array as Float32Array;
    const glowPos = glowPositions.array as Float32Array;
    for (let i = 0; i < count; i++) {
      let k = 0;
      if (blending) k = ease(clamp01((t - seed[i] * 0.3) / 0.7));
      if (k === 0) {
        p.set(posA[i * 3], posA[i * 3 + 1], posA[i * 3 + 2]);
        q.set(quatA[i * 4], quatA[i * 4 + 1], quatA[i * 4 + 2], quatA[i * 4 + 3]);
        s.setScalar(scaleA[i]);
        glowArray[i] = glowA[i];
      } else {
        p.set(
          posA[i * 3] + (posB[i * 3] - posA[i * 3]) * k,
          posA[i * 3 + 1] + (posB[i * 3 + 1] - posA[i * 3 + 1]) * k,
          posA[i * 3 + 2] + (posB[i * 3 + 2] - posA[i * 3 + 2]) * k,
        );
        let bx = quatB[i * 4];
        let by = quatB[i * 4 + 1];
        let bz = quatB[i * 4 + 2];
        let bw = quatB[i * 4 + 3];
        const ax = quatA[i * 4];
        const ay = quatA[i * 4 + 1];
        const az = quatA[i * 4 + 2];
        const aw = quatA[i * 4 + 3];
        if (ax * bx + ay * by + az * bz + aw * bw < 0) {
          bx = -bx;
          by = -by;
          bz = -bz;
          bw = -bw;
        }
        q.set(
          ax + (bx - ax) * k,
          ay + (by - ay) * k,
          az + (bz - az) * k,
          aw + (bw - aw) * k,
        ).normalize();
        /* A little lift mid-flight so blocks arc instead of sliding. */
        p.y += Math.sin(k * Math.PI) * 1.6 * seed[i];
        s.setScalar(scaleA[i] + (scaleB[i] - scaleA[i]) * k);
        glowArray[i] = glowA[i] + (glowB[i] - glowA[i]) * k + Math.sin(k * Math.PI) * 0.5;
      }
      matrix.compose(p, q, s);
      blocks.setMatrixAt(i, matrix);
      glowPos[i * 3] = p.x;
      glowPos[i * 3 + 1] = p.y;
      glowPos[i * 3 + 2] = p.z;
    }
    blocks.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;
    glowPositions.needsUpdate = true;

    const camT = blending ? t : 0;
    camPos.lerpVectors(a.cam, b.cam, camT);
    camLook.lerpVectors(a.look, b.look, camT);
    const drift = reduced ? 0 : Math.sin(time * 0.3) * 0.25;
    camPos.x += smoothX * 0.9 + drift;
    camPos.y += smoothY * 0.5 + Math.cos(time * 0.23) * (reduced ? 0 : 0.15);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    gridMaterial.uniforms.uCam.value.copy(camPos);
    gridMaterial.uniforms.uOpacity.value = a.grid + (b.grid - a.grid) * camT;
    dustPoints.rotation.y = time * 0.012;
  };

  const frame = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) time += dt;
    const follow = 1 - Math.exp(-dt * (reduced ? 30 : 5.5));
    progress += (target - progress) * follow;
    const pointerFollow = 1 - Math.exp(-dt * 4);
    smoothX += (pointerX - smoothX) * pointerFollow;
    smoothY += (pointerY - smoothY) * pointerFollow;
    update();
    renderer.render(scene, camera);
  };

  const start = () => {
    if (raf || disposed) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  start();

  return {
    setProgress(value) {
      target = value;
    },
    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
    },
    setReducedMotion(value) {
      reduced = value;
    },
    dispose() {
      disposed = true;
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.map?.dispose();
      glowMaterial.dispose();
      dustGeometry.dispose();
      (dustPoints.material as THREE.Material).dispose();
      grid.geometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
    },
  };
}

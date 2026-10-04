import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { C, W } from './layout.js';
import { M, floorMat } from './materials.js';

const WALL = 4.5, T = 0.4;
const HOT = { emissive: 0xff8a2a, emissiveIntensity: 0.8 };
const E = M.enamel;

// m = hex colour (matte paint) or a material from materials.js
const mesh = (geo, g, m, x, y, z, o = {}) => {
  const mat = typeof m === 'number' ? new THREE.MeshStandardMaterial({ color: m, roughness: 0.6, ...o }) : m;
  const mh = new THREE.Mesh(geo, mat);
  mh.position.set(x, y, z);
  mh.castShadow = !mat.transparent;
  mh.receiveShadow = true;
  g.add(mh);
  return mh;
};
export const box = (g, w, h, d, m, x, y, z, o) => mesh(new THREE.BoxGeometry(w, h, d), g, m, x, y + h / 2, z, o);
const cyl = (g, r, h, m, x, y, z, o) => mesh(new THREE.CylinderGeometry(r, r, h, 32), g, m, x, y + h / 2, z, o);

// b = box, c = cylinder, Z(o) = z at offset o from outer wall, s = direction into the room
const PROPS = {
  kitchen: (b, c, z, Z) => {
    const cx = z.w / 2;
    b(z.w - 4, 3, 2.5, M.steel, cx, 0, Z(2));                          // prep counter
    b(z.w - 6, 0.2, 1, M.steel, cx, 5.5, Z(0.8));                      // wall shelf
    for (let i = 0; i < 5; i++) b(1.1, 1, 0.9, z.color, 4 + i * 2.4, 5.7, Z(0.8)); // coded containers
    b(z.w - 8, 3, 2.5, M.dark, cx, 0, Z(6.5));                         // gas range
    for (let i = 0; i < 4; i++) {
      const x = cx - 4 + i * 2.7;
      c(0.7, 0.15, 0x111111, x, 3, Z(6.5));                            // burner
      if (i % 2 === 0) c(0.95, 1.2, M.steel, x, 3.15, Z(6.5));         // pot
    }
    b(z.w - 6, 0.8, 5, M.hood, cx, 7.5, Z(5));                         // exhaust hood
    b(z.w - 6, 3, 3, M.steel, cx, 0, Z(12));                           // prep island
    b(z.w - 6, 0.15, 3.1, z.color, cx, 3, Z(12));                      // colour-coded top
    b(z.w - 6, 0.05, 0.6, M.dark, cx, 0, Z(9));                        // trench drain
    b(4, 3, 2.5, M.steel, z.w - 4, 0, Z(15.5));                        // pot-wash sink
    c(0.12, 1.4, M.steel, z.w - 4, 3, Z(14.6));                        // tap
  },
  gas: (b, c, z, Z) => {
    for (const o of [3, 7]) for (let i = 0; i < 4; i++) {
      c(0.75, 4.5, E(0xe0463a), 2 + i * 2, 0, Z(o));
      c(0.3, 0.4, M.dark, 2 + i * 2, 4.5, Z(o));
    }
    b(7, 0.3, 0.3, M.steel, 5, 5.2, Z(1));                             // manifold pipe
  },
  staff: (b, c, z, Z) => {
    for (let i = 0; i < 6; i++) b(1.6, 6, 1.6, E(0x7e6bc4), 1.5 + i * 1.7, 0, Z(1.2));
    b(8, 1.5, 1.5, M.wood, 6, 0, Z(7));                                // bench
    b(3, 1.4, 2, E(0xffffff), 3, 0, Z(11));                            // restrooms
    b(3, 1.4, 2, E(0xffffff), 9, 0, Z(11));
    for (const x of [4, 8]) b(0.4, 7, 0.4, M.steel, x, 0, Z(16));      // air shower arch
    b(4.4, 0.4, 0.4, M.steel, 6, 7, Z(16));
  },
  pack: (b, c, z, Z) => {
    const cx = z.w / 2;
    b(z.w - 4, 3, 2.5, M.steel, cx, 0, Z(2));                          // hot pass
    for (let i = 0; i < 5; i++) c(0.5, 0.5, 0xffb347, 3 + i * 4, 5.5, Z(2), HOT); // heat lamps
    b(z.w - 6, 2.5, 2, M.dark, cx, 0, Z(8));                           // conveyor
    b(z.w - 6, 0.15, 1.6, M.rubber, cx, 2.5, Z(8));                    // belt
    for (let i = 0; i < 4; i++) b(1.4, 1, 1.4, M.wood, cx - 6 + i * 4, 2.65, Z(8)); // parcels
    b(2.5, 2.5, 2.5, M.steel, 4, 0, Z(13));                            // sealing machine
  },
  dock: (b, c, z, Z) => {
    b(14, 7, 7.4, E(0xf7f7f7), -8, 2.2, 9);                            // truck
    b(4, 5, 7.4, E(0x34506b), -16.5, 2.2, 9);
    b(0.1, 2, 5.8, M.glass, -18.55, 4.6, 9);                           // windshield
    for (const x of [-4, -11, -16]) for (const dz of [-3.8, 3.8])
      c(1.3, 0.8, M.rubber, x, 0.9, 9 + dz).rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) b(2.5, 2.5, 2.5, M.wood, 3 + (i % 2) * 3, 0, Z(4 + (i >> 1) * 3));
    b(5, 3, 2.5, M.steel, 7, 0, Z(14));                                // inspection table
  },
  waste: (b, c, z, Z) => {
    [0x4fb477, 0x4a90d9, 0xf7c948].forEach((col, i) => {               // wet, dry, recyclable
      b(2, 3, 2, E(col), 2 + i * 2.4, 0, Z(3));
      b(2.2, 0.3, 2.2, M.dark, 2 + i * 2.4, 3, Z(3));
    });
  },
  dry: (b, c, z, Z) => {
    const cx = z.w / 2;
    for (const o of [3, 8]) {
      for (const x of [2, z.w - 2]) for (const dz of [-1, 1]) b(0.2, 7, 0.2, M.steel, x, 0, Z(o + dz));
      [1, 3.2, 5.4].forEach((y, k) => {
        b(z.w - 3.8, 0.2, 2, M.steel, cx, y, Z(o));
        for (let i = 0; i < 5; i++)
          b(1.2, 1.1, 1.2, [0xe6b566, 0xd98e73, 0xb5c99a][(i + k) % 3], 3 + i * 1.5, y + 0.2, Z(o));
      });
    }
  },
  cold: (b, c, z) => {
    b(z.w - 3, 6, z.d - 6, E(0xffffff), z.w / 2, 0, z.d / 2);          // insulated room
    b(3.2, 5.2, 0.3, E(z.accent), z.w / 2, 0, 2.85);                   // door
    b(0.15, 1.5, 0.15, M.steel, z.w / 2 + 1.2, 2, 2.6);                // handle
    b(3, 1.2, 3, M.steel, z.w / 2, 6, z.d / 2);                        // compressor
  },
  tandoor: (b, c, z) => {
    [[3.5, 6], [8.5, 6], [6, 12]].forEach(([x, zz]) => {
      c(1.7, 3.6, 0xb5651d, x, 0, zz);                                 // clay body
      c(1.75, 0.3, M.steel, x, 3.6, zz);                               // rim
      c(1.1, 0.05, 0xff7a1a, x, 3.9, zz, HOT);                         // fire glow
    });
    b(10, 0.8, 9, M.hood, 6, 8, 9);                                    // canopy
    b(10, 3, 1.6, M.steel, 6, 0, 17.1);                                // naan counter
  },
  elec: (b, c, z, Z) => {
    for (let i = 0; i < 3; i++) {
      const x = 2.5 + i * 4.2;
      b(2.4, 2.8, 2.4, M.steel, x, 0, Z(3));                           // heavy mixers
      c(0.9, 2.2, M.steel, x, 2.8, Z(3));
      c(0.95, 0.3, E(0x2f6fb5), x, 3.6, Z(3));
    }
    b(z.w - 4, 3, 2.5, M.steel, z.w / 2, 0, Z(9));                     // wet-grinder counter
    for (let i = 0; i < 3; i++) c(1, 1.8, M.dark, 3 + i * 4, 3, Z(9));
  },
  bake: (b, c, z, Z, s) => {
    for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) {
      b(3.6, 2, 3, M.dark, 2.6 + i * 4, k * 2.1, Z(2.5));              // deck ovens
      b(2.6, 1, 0.1, 0xffc48a, 2.6 + i * 4, k * 2.1 + 0.5, Z(2.5) + s * 1.55, HOT);
    }
    b(2.4, 6, 2.5, E(0xf3f4f6), 12, 0, Z(3));                          // proofer
    for (const x of [4, 10]) {
      b(5, 3, 3, M.marble, x, 0, Z(10));                               // marble tables
      c(0.7, 0.3, 0xf1d9a8, x, 3, Z(10));
    }
  },
  me: (b, c, z, Z) => {
    b(5, 7, 2, E(0x56606b), z.w / 2, 0, Z(3));
    b(5, 0.5, 2.05, 0xf7c948, z.w / 2, 3, Z(3));
    c(1.3, 8, M.steel, z.w / 2, 0, Z(10));                            // exhaust duct
  },
};

export function buildZone(z, parent) {
  const g = new THREE.Group();
  g.position.set(z.x, 0, z.z);
  parent.add(g);

  const top = z.z === 0;
  const s = top ? 1 : -1;
  const Z = (o) => (top ? o : z.d - o);
  const side = top ? z.d : 0, outer = top ? 0 : z.d;

  box(g, z.w, 0.2, z.d, floorMat(z.color, z.w, z.d), z.w / 2, 0, z.d / 2);

  const props = new THREE.Group();
  props.position.y = 0.2;
  g.add(props);
  PROPS[z.kind]((...a) => box(props, ...a), (...a) => cyl(props, ...a), z, Z, s);

    const wall = (w, d, x, zz, cap) => {
    box(g, w, 1.2, d, M.wall, x, 0, zz);                              // solid base
    box(g, w, 3, d, M.glass, x, 1.2, zz);                             // frosted glass above
    if (cap) box(g, w, 0.25, d + 0.1, E(z.accent ?? z.color), x, 4.2, zz); // colour cap
  };
  const hw = (a, b2, zz, cap) => wall(b2 - a, T, (a + b2) / 2, zz, cap);
  hw(0, z.w / 2 - 2, side, true);
  hw(z.w / 2 + 2, z.w, side, true);
  hw(0, z.w, outer);
  if (z.open !== 'left') wall(T, z.d, 0, z.d / 2);
  if (z.x + z.w === W && z.open !== 'right') wall(T, z.d, z.w, z.d / 2);

  const el = document.createElement('div');
  el.className = 'tag';
  el.textContent = z.short;
  const label = new CSS2DObject(el);
  label.position.set(z.w / 2, 8, z.d / 2);
  g.add(label);
  return g;
}
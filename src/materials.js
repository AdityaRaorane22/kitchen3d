import * as THREE from 'three';

const canvasTex = (size, draw) => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

// white tile face + soft grout lines, tinted by the material colour
const tileTex = canvasTex(256, (g, s) => {
  g.fillStyle = '#fff';
  g.fillRect(0, 0, s, s);
  g.strokeStyle = '#cfcfcf';
  g.lineWidth = 6;
  g.strokeRect(0, 0, s, s);
});

// glossy epoxy tile floor, 2 ft tiles
export const floorMat = (color, w, d) => {
  const map = tileTex.clone();
  map.needsUpdate = true;
  map.repeat.set(w / 2, d / 2);
  return new THREE.MeshPhysicalMaterial({ color, map, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.25 });
};

const steel = { color: 0xd5dbe0, metalness: 1, roughness: 0.32 };

export const M = {
  steel: new THREE.MeshStandardMaterial(steel),
  hood: new THREE.MeshStandardMaterial({ ...steel, roughness: 0.3, transparent: true, opacity: 0.5 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2b2e34, metalness: 0.4, roughness: 0.45 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.9 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xc8975b, roughness: 0.8 }),
  marble: new THREE.MeshPhysicalMaterial({ color: 0xf5f1ea, roughness: 0.15, clearcoat: 1 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xdff1ff, roughness: 0, transparent: true, opacity: 0.3 }),
  enamel: (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.35, clearcoat: 0.6 }),
};
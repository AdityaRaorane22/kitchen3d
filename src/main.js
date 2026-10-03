import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { C, W, D, ZONES } from './layout.js';
import { buildZone, box } from './builders.js';
import { floorMat } from './materials.js';
import { STEPS } from './tour.js';
import './style.css';

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);
scene.fog = new THREE.Fog(C.bg, 150, 300);
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 500);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;   // keeps colour-coding accurate
renderer.toneMappingExposure = 1.05;
document.body.append(renderer.domElement);

const labels = new CSS2DRenderer();
labels.domElement.className = 'labels';
document.body.append(labels.domElement);

const controls = new OrbitControls(camera, labels.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.2;

// lighting: studio reflections + sun
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.75;
scene.add(new THREE.HemisphereLight(0xffffff, 0xe9dccb, 0.5));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.2);
sun.position.set(-40, 80, 60);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.05;
sun.shadow.radius = 4;
Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 50, bottom: -50, near: 1, far: 220 });
scene.add(sun);

// shadow-catcher ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: 0.18 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.61;
ground.receiveShadow = true;
scene.add(ground);

// model
const model = new THREE.Group();
model.position.set(-W / 2, 0, -D / 2);
scene.add(model);
box(model, W + 6, 0.6, D + 6, 0xd8cfc0, W / 2, -0.6, D / 2);              // plinth
box(model, W, 0.2, 4, floorMat(C.corridor, W, 4), W / 2, 0, 20);          // corridor
ZONES.forEach((z) => buildZone(z, model));

const tag = (text, x, z) => {
  const el = Object.assign(document.createElement('div'), { className: 'tag', textContent: text });
  const l = new CSS2DObject(el);
  l.position.set(x, 4, z);
  model.add(l);
};
tag('DISPATCH →', W + 4, 9);
tag('← INBOUND', -4, 31);

// material-flow dots along the corridor
const dots = [...Array(8)].map(() => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), new THREE.MeshBasicMaterial({ color: 0x2ec4b6 }));
  m.position.set(0, 1, 20);
  model.add(m);
  return m;
});

// tour
const $ = (s) => document.querySelector(s);
const goal = { pos: new THREE.Vector3(), tgt: new THREE.Vector3() };
let i = 0, flying = false, auto = null;

function show(n) {
  i = (n + STEPS.length) % STEPS.length;
  const s = STEPS[i];
  $('#title').textContent = s.title;
  $('#text').textContent = s.text;
  $('#count').textContent = `${i + 1} / ${STEPS.length}`;
  goal.pos.copy(s.cam);
  goal.tgt.copy(s.target);
  flying = true;
}
camera.position.copy(STEPS[0].cam);
controls.target.copy(STEPS[0].target);
show(0);

controls.addEventListener('start', () => (flying = false));
$('#next').onclick = () => show(i + 1);
$('#prev').onclick = () => show(i - 1);
$('#auto').onclick = (e) => {
  if (auto) { clearInterval(auto); auto = null; e.target.textContent = '▶ Auto'; }
  else { auto = setInterval(() => show(i + 1), 7000); e.target.textContent = '❚❚ Stop'; }
};
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') show(i + 1);
  if (e.key === 'ArrowLeft') show(i - 1);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
});
dispatchEvent(new Event('resize'));

renderer.setAnimationLoop((t) => {
  if (flying) {
    camera.position.lerp(goal.pos, 0.035);
    controls.target.lerp(goal.tgt, 0.035);
    if (camera.position.distanceTo(goal.pos) < 0.1) flying = false;
  }
  dots.forEach((d, k) => (d.position.x = 6 + ((t / 1000 * 6 + k * 11) % 88)));
  controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

$('#rec').onclick = async (e) => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 60 }, preferCurrentTab: true,
  });
  const chunks = [];
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12e6 });
  rec.ondataavailable = (ev) => chunks.push(ev.data);
  rec.onstop = () => {
    stream.getTracks().forEach((t) => t.stop());
    Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })),
      download: 'kitchen-walkthrough.webm',
    }).click();
  };
  rec.start();
  show(0);
  if (!auto) $('#auto').click();       // starts the tour
  e.target.textContent = '■ Stop';
  e.target.onclick = () => rec.stop(); // press again after the last step
};
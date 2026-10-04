import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { C, W, D, ZONES } from './layout.js';
import { buildZone, box } from './builders.js';
import { floorMat } from './materials.js';
import { STEPS, VIEWS } from './tour.js';
import './style.css';

const $ = (s) => document.querySelector(s);
const lay = (x, y, z) => new THREE.Vector3(x - W / 2, y, z - D / 2);
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

// renderer (transparent, so the CSS sky shows through)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.append(renderer.domElement);

const labels = new CSS2DRenderer();
labels.domElement.className = 'labels';
document.body.append(labels.domElement);

const controls = new OrbitControls(camera, labels.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.2;

// light: studio reflections + soft sun
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.85;
scene.add(new THREE.HemisphereLight(0xffffff, 0xf1e6d6, 0.6));
const sun = new THREE.DirectionalLight(0xfff1dc, 2);
sun.position.set(-40, 80, 60);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.05;
sun.shadow.radius = 5;
Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 50, bottom: -50, near: 1, far: 220 });
scene.add(sun);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: 0.12 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.61;
ground.receiveShadow = true;
scene.add(ground);

// model
const model = new THREE.Group();
model.position.set(-W / 2, 0, -D / 2);
scene.add(model);
box(model, W + 6, 0.6, D + 6, 0xe6dfd2, W / 2, -0.6, D / 2);      // plinth
box(model, W, 0.2, 4, floorMat(C.corridor, W, 4), W / 2, 0, 20);  // corridor
const groups = ZONES.map((z) => buildZone(z, model));

// plants along the corridor
const deco = new THREE.Group();
model.add(deco);
const leaf = new THREE.MeshStandardMaterial({ color: 0x6fbf8b, roughness: 0.8 });
const plant = (x, z) => {
  box(deco, 1.4, 1, 1.4, 0xf4efe6, x, 0.2, z);
  for (const [dx, dy, r] of [[0, 1.9, 0.9], [0.5, 1.4, 0.6], [-0.5, 1.5, 0.6]]) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), leaf);
    s.position.set(x + dx, dy + 0.2, z);
    s.castShadow = true;
    deco.add(s);
  }
};
[10, 22, 42, 60, 78, 92].forEach((x) => plant(x, 18.9));
groups.push(deco);
groups.forEach((g) => (g.scale.y = 0.001));                       // start flat, rise later

const tag = (text, x, z) => {
  const el = Object.assign(document.createElement('div'), { className: 'tag', textContent: text });
  const l = new CSS2DObject(el);
  l.position.set(x, 4, z);
  model.add(l);
};
tag('DISPATCH →', W + 4, 9);
tag('← INBOUND', -4, 31);

// material-flow dots
const dots = [...Array(8)].map(() => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), new THREE.MeshBasicMaterial({ color: 0x3aa99f }));
  m.position.set(0, 1, 20);
  model.add(m);
  return m;
});

// camera flight
const goal = { pos: new THREE.Vector3(), tgt: new THREE.Vector3() };
let flying = false;
const fly = (p, t) => { goal.pos.copy(p); goal.tgt.copy(t); flying = true; };
controls.addEventListener('start', () => (flying = false));

// walkthrough
let i = 0, auto = null;
function show(n) {
  i = (n + STEPS.length) % STEPS.length;
  const s = STEPS[i];
  $('#title').textContent = s.title;
  $('#text').textContent = s.text;
  $('#count').textContent = `Step ${i + 1} of ${STEPS.length}`;
  fly(s.cam, s.target);
}
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

// zones + capture lists
$('#zone-list').innerHTML = ZONES.map((z, k) =>
  `<li data-k="${k}"><i style="background:${hex(z.accent ?? z.color)}"></i>${z.label}<small>${z.w * z.d} sq ft</small></li>`).join('');
$('#zone-list').onclick = (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const z = ZONES[li.dataset.k];
  const cx = z.x + z.w / 2, cz = z.z + z.d / 2;
  fly(lay(cx, 24, cz + 26), lay(cx, 0, cz));
};

let viewName = 'kitchen-aakar';
$('#view-list').innerHTML = VIEWS.map((v, k) => `<li data-k="${k}">${v.title}</li>`).join('');
$('#view-list').onclick = (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const v = VIEWS[li.dataset.k];
  viewName = v.title;
  fly(v.cam, v.target);
};

$('#shot').onclick = () => {
  const old = renderer.getPixelRatio();
  scene.background = new THREE.Color(0xf4efe8);               // solid background for the PNG
  renderer.setPixelRatio(2);
  renderer.setSize(innerWidth, innerHeight);
  renderer.render(scene, camera);
  Object.assign(document.createElement('a'), {
    href: renderer.domElement.toDataURL('image/png'),
    download: viewName + '.png',
  }).click();
  scene.background = null;
  renderer.setPixelRatio(old);
  renderer.setSize(innerWidth, innerHeight);
};

$('#rec').onclick = async (e) => {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 60 }, preferCurrentTab: true });
  const chunks = [];
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12e6 });
  rec.ondataavailable = (ev) => chunks.push(ev.data);
  rec.onstop = () => {
    stream.getTracks().forEach((t) => t.stop());
    Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })),
      download: 'aakar-kitchen-walkthrough.webm',
    }).click();
  };
  rec.start();
  show(0);
  if (!auto) $('#auto').click();
  e.target.textContent = '■ Stop recording';
  e.target.onclick = () => rec.stop();
};

// tabs + draggable window
const win = $('#win'), head = $('.win-head');
const TITLES = { tour: 'Walkthrough', zones: 'Zones', capture: 'Capture' };
let openTab = null;
function openWin(name) {
  openTab = openTab === name ? null : name;
  win.hidden = !openTab;
  if (openTab) {
    $('#win-title').textContent = TITLES[openTab];
    document.querySelectorAll('.tab').forEach((t) => (t.hidden = t.id !== 'tab-' + openTab));
  }
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === openTab));
}
document.querySelectorAll('#tabs button').forEach((b) => (b.onclick = () => openWin(b.dataset.tab)));
$('#win-x').onclick = () => openWin(openTab);

head.onpointerdown = (e) => {
  if (e.target.id === 'win-x') return;
  const r = win.getBoundingClientRect();
  const dx = e.clientX - r.left, dy = e.clientY - r.top;
  head.setPointerCapture(e.pointerId);
  head.onpointermove = (m) => {
    win.style.left = Math.min(Math.max(0, m.clientX - dx), innerWidth - r.width) + 'px';
    win.style.top = Math.min(Math.max(0, m.clientY - dy), innerHeight - 60) + 'px';
  };
  head.onpointerup = () => (head.onpointermove = null);
};

// intro sequence
camera.position.set(-70, 130, 160);
controls.target.copy(STEPS[0].target);
const t0 = performance.now() + 1700;
setTimeout(() => $('#loader').classList.add('off'), 1700);
setTimeout(() => show(0), 1800);
setTimeout(() => document.body.classList.add('ready'), 4300);
setTimeout(() => { if (!openTab) openWin('tour'); }, 4600);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
});
dispatchEvent(new Event('resize'));

renderer.setAnimationLoop((t) => {
  const k = (t - t0) / 1000;
  groups.forEach((g, n) => {                                  // zones rise one by one
    const p = Math.min(Math.max((k - n * 0.12) / 0.8, 0), 1);
    g.scale.y = Math.max(0.001, 1 - Math.pow(1 - p, 3));
  });
  if (flying) {
    camera.position.lerp(goal.pos, 0.035);
    controls.target.lerp(goal.tgt, 0.035);
    if (camera.position.distanceTo(goal.pos) < 0.1) flying = false;
  }
  dots.forEach((d, n) => (d.position.x = 6 + ((t / 1000 * 6 + n * 11) % 88)));
  controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});
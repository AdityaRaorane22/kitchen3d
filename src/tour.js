import * as THREE from 'three';
import { W, D } from './layout.js';

// v(x, height, z) in layout feet (model is centred in the scene)
const v = (x, y, z) => new THREE.Vector3(x - W / 2, y, z - D / 2);

export const STEPS = [
  { title: 'Overview', cam: v(50, 70, 88), target: v(50, 0, 20),
    text: '4,000 sq ft, 100′ × 40′. 20 staff per shift, 3 shifts. One rule: material only moves one way, Receiving → Storage → Prep → Cooking → Packaging → Dispatch.' },
  { title: 'Loading Dock & Receiving', cam: v(10, 18, 54), target: v(8, 0, 30),
    text: 'Every delivery is inspected here before it enters the kitchen.' },
  { title: 'Storage', cam: v(32, 22, 56), target: v(32, 0, 30),
    text: 'Warm dry storage on wire shelving, plus separate Veg and Non-Veg cold rooms. No cross-contact, even before cooking.' },
  { title: 'Processing Zone', cam: v(70, 24, 58), target: v(70, 0, 30),
    text: 'Central tandoor, heavy mixers and grinders, and the temperature-controlled baking area. Noisy machines sit away from the cooking lines.' },
  { title: 'Colour-coded Kitchens', cam: v(50, 28, 42), target: v(50, 0, 9),
    text: 'Red Non-Veg, Green Veg, Yellow Jain. Each has its own prep, sinks, utensils, gas range and backup induction. Jain is kept away from root-veg prep.' },
  { title: 'Safety & Staff', cam: v(14, 20, 38), target: v(12, 0, 9),
    text: 'Gas stock room with auto shut-off and leak detection, induction backup for LPG shortages, and staff entry via air shower into lockers and restrooms.' },
  { title: 'Pickup & Dispatch', cam: v(90, 20, 38), target: v(90, 0, 9),
    text: 'Heat lamps, hot pass, sealing and conveyor, then straight out the dispatch door to Swiggy / Zomato partners.' },
  { title: 'Wrap-up', cam: v(50, 70, 88), target: v(50, 0, 20),
    text: 'Easy to maintain, hygienic, clutter-free, and practical within our ₹25–30 lakh budget.' },
];
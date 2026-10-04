export const W = 100, D = 40;

export const C = {
  corridor: 0xfdfaf4, steel: 0xcfd6dc, dark: 0x3b3f46,
};

// x, z, w, d in feet. Back row z=0..18, corridor 18..22, front row z=22..40
const T = { z: 0, d: 18 }, B = { z: 22, d: 18 };

export const ZONES = [
  // back row
  { id: 'gas',    label: 'Gas Stock Room',         short: 'Gas Room',   x: 0,  w: 10, ...T, color: 0xf7b980, kind: 'gas' },
  { id: 'staff',  label: 'Staff Lockers & Restrooms', short: 'Staff',   x: 10, w: 12, ...T, color: 0xcfc4ee, kind: 'staff' },
  { id: 'nonveg', label: 'Non-Veg Kitchen',        short: 'Non-Veg',    x: 22, w: 20, ...T, color: 0xe8736a, kind: 'kitchen' },
  { id: 'veg',    label: 'Veg Kitchen',            short: 'Veg',        x: 42, w: 18, ...T, color: 0x6cc08b, kind: 'kitchen' },
  { id: 'jain',   label: 'Jain Kitchen',           short: 'Jain',       x: 60, w: 18, ...T, color: 0xf5d56a, kind: 'kitchen' },
  { id: 'pack',   label: 'Pickup & Packaging',     short: 'Pickup',     x: 78, w: 22, ...T, color: 0x62cfc3, kind: 'pack', open: 'right' },
  // front row
  { id: 'dock',   label: 'Loading Dock',           short: 'Loading',    x: 0,  w: 12, ...B, color: 0xb9c6d3, kind: 'dock', open: 'left' },
  { id: 'waste',  label: 'Waste Management',       short: 'Waste',      x: 12, w: 8,  ...B, color: 0xb9c9ae, kind: 'waste' },
  { id: 'dry',    label: 'Warm Dry Storage',       short: 'Dry Store',  x: 20, w: 12, ...B, color: 0xf0dcc0, kind: 'dry' },
  { id: 'coldv',  label: 'Cold Storage · Veg',     short: 'Cold · Veg', x: 32, w: 10, ...B, color: 0xd6f0e1, accent: 0x6cc08b, kind: 'cold' },
  { id: 'coldn',  label: 'Cold Storage · Non-Veg', short: 'Cold · Non-Veg', x: 42, w: 10, ...B, color: 0xf8d9d2, accent: 0xe8736a, kind: 'cold' },
  { id: 'tandoor',label: 'Central Tandoor',        short: 'Tandoor',    x: 52, w: 12, ...B, color: 0xeaa664, kind: 'tandoor' },
  { id: 'elec',   label: 'Electrical Appliances',  short: 'Appliances', x: 64, w: 14, ...B, color: 0xbfcddb, kind: 'elec' },
  { id: 'bake',   label: 'Baking & Pastry',        short: 'Bakery',     x: 78, w: 14, ...B, color: 0xf6c4aa, kind: 'bake' },
  { id: 'me',     label: 'M&E Panel & Exhaust',    short: 'M&E',        x: 92, w: 8,  ...B, color: 0xa3acb7, kind: 'me' },
];
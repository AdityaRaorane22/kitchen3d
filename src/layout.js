export const W = 100, D = 40;

export const C = {
  bg: 0xf4efe8, plinth: 0xd8cfc0, corridor: 0xfaf6ee, wall: 0xffffff,
  steel: 0xcfd6dc, dark: 0x3b3f46,
};

// x, z, w, d in feet. Back row z=0..18, corridor 18..22, front row z=22..40
const T = { z: 0, d: 18 }, B = { z: 22, d: 18 };

export const ZONES = [
  // back row
  { id: 'gas',    label: 'Gas Stock Room',        x: 0,  w: 10, ...T, color: 0xf6a35c, kind: 'gas' },
  { id: 'staff',  label: 'Staff Lockers & Restrooms', x: 10, w: 12, ...T, color: 0xc3b5ea, kind: 'staff' },
  { id: 'nonveg', label: 'Non-Veg Kitchen',       x: 22, w: 20, ...T, color: 0xe0483e, kind: 'kitchen', sub: 'Red coded' },
  { id: 'veg',    label: 'Veg Kitchen',           x: 42, w: 18, ...T, color: 0x4fb477, kind: 'kitchen', sub: 'Green coded' },
  { id: 'jain',   label: 'Jain Kitchen',          x: 60, w: 18, ...T, color: 0xf7c948, kind: 'kitchen', sub: 'Yellow · no root veg' },
  { id: 'pack',   label: 'Pickup & Packaging',    x: 78, w: 22, ...T, color: 0x2ec4b6, kind: 'pack', open: 'right' },
  // front row
  { id: 'dock',   label: 'Loading Dock',          x: 0,  w: 12, ...B, color: 0xa9b7c6, kind: 'dock', open: 'left' },
  { id: 'waste',  label: 'Waste Management',      x: 12, w: 8,  ...B, color: 0xa8b89c, kind: 'waste', sub: 'Wet · Dry · Rec' },
  { id: 'dry',    label: 'Warm Dry Storage',      x: 20, w: 12, ...B, color: 0xead2ae, kind: 'dry' },
  { id: 'coldv',  label: 'Cold Storage · Veg',    x: 32, w: 10, ...B, color: 0xcdeedd, accent: 0x4fb477, kind: 'cold', sub: '+2 to +4 °C' },
  { id: 'coldn',  label: 'Cold Storage · Non-Veg',x: 42, w: 10, ...B, color: 0xf7cfc4, accent: 0xe0483e, kind: 'cold', sub: '−18 °C' },
  { id: 'tandoor',label: 'Central Tandoor',       x: 52, w: 12, ...B, color: 0xe0903f, kind: 'tandoor', sub: 'High-CFM canopy' },
  { id: 'elec',   label: 'Electrical Appliances', x: 64, w: 14, ...B, color: 0xaebdcc, kind: 'elec' },
  { id: 'bake',   label: 'Baking & Pastry',       x: 78, w: 14, ...B, color: 0xf4b393, kind: 'bake', sub: '22 °C' },
  { id: 'me',     label: 'M&E Panel & Exhaust',   x: 92, w: 8,  ...B, color: 0x8b95a1, kind: 'me' },
];
// utils/constants.ts

// utils/constants.ts

// Juridisk definition (Hur vinifierades det?)
export const WINE_CATEGORIES = [
  'Still wine', 
  'Sparkling wine', 
  'Fortified wine', // Likställt med Liqueur wine
  'De-alcoholised wine' // Om du vill ha med alkoholfritt
];

// Stil/Färg (Vad ser kunden i glaset?)
export const WINE_TYPES = [
  'Red', 
  'White', 
  'Rose', 
  'Orange', 
  'Sweet', // Kan användas om man inte vill ange färg primärt
  'Sparkling' // Stilval
];

export const BOTTLE_VOLUMES = [
  '187ml',
  '375ml', 
  '500ml', 
  '750ml', 
  '1000ml',
  '1500ml', 
  '3000ml'
];

export const HARVEST_METHODS = [
    'Handpicked', 
    'Machine-harvested', 
    'Mixed (Handpicked + Machine)'
];

export const FERMENTATION_VESSELS = [
    'Stainless steel tank', 
    'Oak barrels', 
    'Amphora (Clay vessels)', 
    'Concrete egg'
];
export const VINEYARD_SOURCES = [
    'Single vineyard', 
    'Blended from multiple vineyards' 
    
];
export const AGING_VESSELS = [
    'No aging', 'Oak barrels', 
    'Stainless steel tanks', 
    'Concrete tanks'
];

export const SPARKLING_DOSAGE_LEVELS = [
    'Brut Nature', 
    'Extra Brut', 
    'Brut', 
    'Extra Dry', 
    'Dry', 
    'Demi-Sec', 
    'Doux'
];

export const SECONDARY_FERMENTATION_TIME = [
  '12 months',
  '18 months',
  '24 months'
];

export const LEES_AGING_OPTIONS = [
    '12 months', 
    '24 months', 
    '36 months', 
    '48 months', 
    '60 months'
];

export const RIDDLING_METHODS = [
    'Hand', 
    'Mechanical'
];

export const DISGORGEMENT_METHODS = [
    'Manual', 
    'Freezing/mechanical'
];

export const PRIMARY_FERMENTATION_VESSELS = [
    'Stainless steel tanks', 
    'Oak barrels', 
    'Concrete tanks'
];

export const BOTTLE_MATERIALS = [
  { label: 'Glass bottle clear', material: 'GL 70' },
  { label: 'Glass bottle green', material: 'GL 71' },
  { label: 'Glass bottle brown', material: 'GL 72' },
  { label: 'Glass bottle black', material: 'GL 73' },
  { label: 'Lightweight glass bottle clear', material: 'GL 70' },
  { label: 'Lightweight glass bottle colored', material: 'GL 71' },
  { label: 'Aluminum can', material: 'ALU 41' },
  { label: 'Plastic bottle', material: 'PET 1' },
  { label: 'Ceramic bottle', material: 'GL 73' }
];

export const CAP_MATERIALS = [
  { label: 'Aluminum screw cap', material: 'ALU 41' },
  { label: 'Steel crown cap', material: 'FE 40' },
  { label: 'Metal capsule', material: 'TIN 42' },
  { label: 'Plastic cap hard', material: 'HDPE 2' },
  { label: 'Plastic cap soft', material: 'LDPE 4' },
  { label: 'Plastic cap standard', material: 'PP 5' },
  { label: 'Plastic film or cellophane', material: 'O 07' },
  { label: 'Wood top', material: 'FOR 50' },
  { label: 'Fabric or textile cover', material: 'TEX 60' },
  { label: 'Laminated plastic and aluminum', material: 'C/ALU 90' }
];

export const CORK_MATERIALS = [
  { label: 'Natural cork', material: 'FOR 51' },
  { label: 'Pressed cork', material: 'FOR 51' },
  { label: 'Technical cork', material: 'FOR 51' },
  { label: 'Sparkling wine cork', material: 'FOR 51' },
  { label: 'Synthetic plastic cork', material: 'LDPE 4' }
];

export const CARDBOARD_MATERIALS = [
  { label: 'Corrugated cardboard box', material: 'PAP 20' },
  { label: 'Thin cardboard box', material: 'PAP 21' },
  { label: 'Eco sugar cane fiber box', material: 'PAP 21' },
  { label: 'Paper wrap', material: 'PAP 22' },
  { label: 'Plastic crate or box', material: 'PP 5' }
];

// Komplett lista för Bag (inklusive sammansatta material)
export const BAG_MATERIALS = [
  { label: 'Silver plastic bag with aluminum', material: 'C/LDPE 90' },
  { label: 'Clear plastic bag standard', material: 'LDPE 4' },
  { label: 'Eco bio based plastic bag', material: 'O 07' },
  { label: 'Recyclable plastic bag', material: 'PP 5' },
  { label: 'Paper and plastic compound bag', material: 'C/PAP 81' },
  { label: 'Paper and aluminum compound bag', material: 'C/PAP 82' }
];

export const CAGE_MATERIALS = [
  { label: 'Steel wire cage', material: 'FE 40' },
  { label: 'Aluminum wire cage', material: 'ALU 41' },
  { label: 'None', material: 'NONE' }
];
// Komplett lista för Tap
export const TAP_MATERIALS = [
  { label: 'Plastic tap', material: 'PP 5' },
  { label: 'Plastic and metal tap', material: 'C/PP 92' },
  { label: 'Wood and plastic tap', material: 'C/FOR 86' },
  { label: 'High density plastic tap', material: 'HDPE 2' }
];

export const SEAL_MATERIALS = [
  { label: 'Sealing wax', material: '20.03.01' },
  { label: 'Natural shellac', material: 'E 904' },
  { label: 'None', material: 'NONE' }
];

// Denna används ENDAST på kundens sida senare
export const RECYCLING_INSTRUCTIONS = {
  'GL 70': 'Glass collection',
  'GL 71': 'Glass collection',
  'GL 72': 'Glass collection',
  'GL 73': 'Glass collection',
  'PET 1': 'Plastic collection',
  'HDPE 2': 'Plastic collection',
  'PVC 3': 'Plastic collection',
  'LDPE 4': 'Plastic collection',
  'PP 5': 'Plastic collection',
  'PS 6': 'Plastic collection',
  'O 07': 'Mixed waste collection',
  'FE 40': 'Metal collection',
  'ALU 41': 'Metal collection',
  'TIN 42': 'Metal collection',
  'PAP 20': 'Paper collection',
  'PAP 21': 'Paper collection',
  'PAP 22': 'Paper collection',
  'FOR 50': 'Organic waste collection',
  'FOR 51': 'Organic waste collection',
  'C/LDPE 90': 'Plastic collection',
  'C/PP 92': 'Mixed waste collection',
  '20.03.01': 'Mixed waste collection'
};
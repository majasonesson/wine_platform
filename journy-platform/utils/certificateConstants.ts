// Certificate codes that match the database
export const CERTIFICATES = [
    { code: 'KRAV', label: 'KRAV Organic', description: 'Swedish organic certification' },
    { code: 'EU_ORGANIC', label: 'EU Organic', description: 'European Union organic certification' },
    { code: 'SQNPI', label: 'SQNPI', description: 'Sustainable Quality Certification New Zealand' },
    { code: 'BIODYNAMIC', label: 'Biodynamic', description: 'Demeter biodynamic certification' },
    { code: 'VEGAN', label: 'Vegan Wine', description: 'Certified vegan wine production' },
    { code: 'FAIR_TRADE', label: 'Fair Trade', description: 'Fair trade certified' },
    { code: 'SUSTAINABLE_WINEGROWING', label: 'Sustainable Winegrowing', description: 'Certified sustainable practices' },
    { code: 'USDA_ORGANIC', label: 'USDA Organic', description: 'United States organic certification' },
    { code: 'TERRA_VITIS', label: 'Terra Vitis', description: 'French sustainable viticulture' },
    { code: 'NATURE_ET_PROGRES', label: 'Nature et Progrès', description: 'French organic and biodynamic' }
] as const;

export type CertificateCode = typeof CERTIFICATES[number]['code'];

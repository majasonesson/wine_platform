export const mockProducers = [
  {
    id: 'P-001',
    fullName: 'Alice Martin',
    email: 'alice.martin@winery.com',
    company: 'Martin Family Vineyards',
    region: 'Burgundy'
  },
  {
    id: 'P-002',
    fullName: 'Luca Bianchi',
    email: 'luca.bianchi@cantina.it',
    company: 'Cantina Bianchi',
    region: 'Piedmont'
  },
  {
    id: 'P-003',
    fullName: 'Sophie Dubois',
    email: 'sophie.dubois@domain.fr',
    company: 'Domaine Dubois',
    region: 'Bordeaux'
  },
];

export const mockProducerWines = {
  'P-001': [
    {
      WineID: 'W-001',
      name: 'Chardonnay Reserve',
      producer: 'Alice Martin',
      company: 'Martin Family Vineyards',
      country: 'France',
      region: 'Burgundy',
      year: 2022,
      type: 'White Wine',
      alcohol: '13.5%',
      volume: '750ml',
      brandName: 'Martin Family Vineyards',
      description: 'A premium Chardonnay with rich buttery notes and subtle oak influence',
      grapeVariety: '100% Chardonnay',
      awards: ['Gold Medal - Burgundy Wine Awards 2023']
    },
    {
      WineID: 'W-002',
      name: 'Pinot Noir Classic',
      producer: 'Alice Martin',
      company: 'Martin Family Vineyards',
      country: 'France',
      region: 'Burgundy',
      year: 2021,
      type: 'Red Wine',
      alcohol: '13%',
      volume: '750ml',
      brandName: 'Martin Family Vineyards',
      description: 'Elegant Pinot Noir with red fruit aromas and silky tannins',
      grapeVariety: '100% Pinot Noir',
      awards: ['Silver Medal - International Wine Challenge 2022']
    },
  ],
  'P-002': [
    {
      WineID: 'W-003',
      name: 'Barolo Riserva',
      producer: 'Luca Bianchi',
      company: 'Cantina Bianchi',
      country: 'Italy',
      region: 'Piedmont',
      year: 2018,
      type: 'Red Wine',
      alcohol: '14.5%',
      volume: '750ml',
      brandName: 'Cantina Bianchi',
      description: 'Traditional Barolo aged for 36 months in large oak barrels',
      grapeVariety: '100% Nebbiolo',
      awards: ['95 points - Wine Spectator']
    },
    {
      WineID: 'W-004',
      name: "Dolcetto d'Alba Superiore",
      producer: 'Luca Bianchi',
      company: 'Cantina Bianchi',
      country: 'Italy',
      region: 'Piedmont',
      year: 2021,
      type: 'Red Wine',
      alcohol: '13.5%',
      volume: '750ml',
      brandName: 'Cantina Bianchi',
      description: 'Fresh and fruity Dolcetto with notes of black cherry and almond',
      grapeVariety: '100% Dolcetto',
      awards: ['90 points - Robert Parker']
    },
  ],
  'P-003': [
    {
      WineID: 'W-005',
      name: 'Graves Blanc',
      producer: 'Sophie Dubois',
      company: 'Domaine Dubois',
      country: 'France',
      region: 'Bordeaux',
      year: 2022,
      type: 'White Wine',
      alcohol: '12.5%',
      volume: '750ml',
      brandName: 'Domaine Dubois',
      description: 'Crisp and mineral-driven white Bordeaux with citrus notes',
      grapeVariety: 'Sauvignon Blanc, Semillon',
      awards: ['Gold Medal - Concours de Bordeaux 2023']
    },
    {
      WineID: 'W-006',
      name: 'Grand Cru Saint-Émilion',
      producer: 'Sophie Dubois',
      company: 'Domaine Dubois',
      country: 'France',
      region: 'Bordeaux',
      year: 2019,
      type: 'Red Wine',
      alcohol: '14%',
      volume: '750ml',
      brandName: 'Domaine Dubois',
      description: 'Complex and age-worthy Bordeaux blend from Saint-Émilion',
      grapeVariety: 'Merlot, Cabernet Franc',
      awards: ['96 points - Wine Enthusiast']
    },
  ],
}; 
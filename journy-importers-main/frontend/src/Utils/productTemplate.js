/* Template for wine product information */
export default {
  // General product information
  BrandName: '',
  Name: '',
  SQPNI: '',
  GTIN: '',
  EAN: '',
  Country: '',
  Region: '',
  District: '',
  ImageURL: '',
  WineYear: '',
  Sustainability: [],
  Organic: false,
  IsPublished: 0,

  // Production Details (flyttad till root-nivå)
  productionDetails: {
    harvestMethod: '',
    fermentationProcess: '',
    agingProcess: '',
    agingMonths: '',
    grapeOrigin: ''
  },

  // Detailed product information
  productInfo: {
    Category: '',
    Type: '',
    NetQuantity: '',
    Grape: '',
    Sulphites: '',
    AlcoholVolume: '',
    OrganicAcid: '',
    ResidualSugar: '',
    Ingredients: '',
    ExpiryDate: '',
    Grape: '',
    MajorGrape: '',
    SecondGrape: '',
    ThirdGrape: '',
    FourthGrape: '',
    MajorGrapePercentage: '',
    SecondGrapePercentage: '',
    ThirdGrapePercentage: '',
    FourthGrapePercentage: '',
    MajorGrapeOther: '',
    SecondGrapeOther: '',
    ThirdGrapeOther: '',
    FourthGrapeOther: '',
  },

  // Nutrition information
  Nutrition: {
    KJ: '',
    Kcal: '',
    Carbs: '',
    CarbsOfSugar: '',
    Energy: '',
  },
  docs: [],
  Certificates: [],
};

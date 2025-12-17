export interface ProductionDetails {
  harvestDate?: string;
  fermentationType?: string;
  agingProcess?: string;
  bottlingDate?: string;
  [key: string]: any;
}

export interface Wine {
  WineID: number;
  BrandName?: string;
  Country?: string;
  CreatedAt: Date;
  District?: string;
  EAN?: string;
  GTIN?: string;
  ImageURL?: string;
  Name?: string;
  Carbs?: string;
  CarbsOfSugar?: string;
  Kcal?: string;
  KJ?: string;
  Organic: boolean;
  AlcoholVolume?: string;
  Grape?: string;
  Ingredients?: string;
  NetQuantity?: string;
  ResidualSugar?: string;
  Type?: string;
  Region?: string;
  SQPNI?: string;
  Sustainability?: string;
  UserID?: number;
  QRCodeUrl?: string;
  WineYear?: number;
  Documents?: string;
  Category?: string;
  productionDetails?: string | ProductionDetails;
  ExpiryDate?: string;
  Certificates?: string;
  Sulphites?: number;
  OrganicAcid?: number;
  MajorGrape?: string;
  MajorGrapePercentage?: number;
  SecondGrape?: string;
  SecondGrapePercentage?: number;
  ThirdGrape?: string;
  ThirdGrapePercentage?: number;
  FourthGrape?: string;
  FourthGrapePercentage?: number;
  IsPublished?: boolean;
}

export interface WineFormData {
  BrandName?: string;
  Name?: string;
  Category?: string;
  Type?: string;
  WineYear?: number;
  EAN?: string;
  GTIN?: string;
  Carbs?: string;
  CarbsOfSugar?: string;
  Kcal?: string;
  KJ?: string;
  Organic?: boolean;
  AlcoholVolume?: string;
  Grape?: string;
  Ingredients?: string;
  NetQuantity?: string;
  ResidualSugar?: string;
  SQPNI?: string;
  Sulphites?: number;
  OrganicAcid?: number;
  productionDetails?: ProductionDetails;
  Certificates?: string;
  ExpiryDate?: string;
  MajorGrape?: string;
  MajorGrapePercentage?: number;
  SecondGrape?: string;
  SecondGrapePercentage?: number;
  ThirdGrape?: string;
  ThirdGrapePercentage?: number;
  FourthGrape?: string;
  FourthGrapePercentage?: number;
  IsPublished?: boolean;
}


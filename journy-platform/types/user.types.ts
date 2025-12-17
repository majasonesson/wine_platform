export interface User {
  UserID: number;
  Email: string;
  FullName: string;
  Company: string;
  Role: 'Admin' | 'Producer' | 'Importer';
  IsWhitelisted: boolean;
  CreatedAt: Date;
  Password: string;
  PasswordResetToken?: string;
  PasswordResetExpires?: Date;
  Region?: string;
  District?: string;
  Country?: string;
  address?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  priceId?: string;
  labels: number;
  stripeCustomerId?: string;
  subscriptionEndDate?: Date;
  hasUsedFreeTier: number;
  ProfileImageUrl?: string;
}

export interface UserCertification {
  CertificationID: number;
  UserID: number;
  CertificationType: string;
  ImageURL?: string;
  ExpiryDate?: Date;
  ReferenceNumber?: string;
  CreatedAt: Date;
}

export interface UserWithCertifications extends Omit<User, 'Password'> {
  certifications: UserCertification[];
}

export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  role: 'Producer' | 'Importer';
  company: string;
  country: string;
  region: string;
  district: string;
  certificationDetails?: Record<string, {
    expiryDate: string;
    referenceNumber: string;
    imageURL?: string;
  }>;
}


export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ConnectionRequest {
  ConnectionID: number;
  ProducerID: number;
  ImporterID: number;
  Status: ConnectionStatus;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface ConnectionRequestWithUser extends ConnectionRequest {
  Company: string;
  FullName: string;
  Email: string;
}


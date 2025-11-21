export interface Catalog {
  _id: string;
  name: string;
  description?: string;
  visible: boolean;
  totalProducts?: number;
  startedAt?: Date;
  endedAt?: Date;
}

export interface CreateCatalogDTO {
  name: string;
  visible?: boolean;
  description?: string;
  startedAt?: Date;
  endedAt?: Date;
}

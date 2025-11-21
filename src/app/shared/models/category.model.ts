export interface Category {
  _id?: string;
  name: string;
  description?: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}
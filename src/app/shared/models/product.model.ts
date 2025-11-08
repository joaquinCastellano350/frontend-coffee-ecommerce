export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    brand?: string;
    imageURL?: string;
    category_id: {name: string, _id: string};
    catalog_id?: {name: string, visible: boolean, _id: string};
    tags?: string[];
}

export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    stock: number;
    brand?: string;
    imageURL?: string;
    category_id: string;
    catalog_id: string;
    tags?: string[];
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    brand?: string;
    imageURL?: string;
    category_id?: string;
    catalog_id?: string;
    tags?: string[];
}
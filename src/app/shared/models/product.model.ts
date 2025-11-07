export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    brand?: string;
    imageURL?: string;
    category_id: {name: string};
    tags?: string[];
}
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateProductDTO, Product, UpdateProductDTO } from "../../shared/models/product.model";
import { BaseHttpService } from "../../core/http/base-http.service";
import { HttpParams } from "@angular/common/http";

export interface ProductQuery {
    category?: string;
    brand?: string;
    name?: string;
    page?: number;
    limit?: number;
}

export interface Paged<T> {
    products: T[];
    total: number;
    page: number;
    limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseHttpService {

    getProducts(query: ProductQuery = {}): Observable<Paged<Product>> {
        let params = new HttpParams();
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, value.toString());
            }
        });
        return this.http.get<Paged<Product>>(`${this.baseUrl}/catalogs/products`, { params });
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
    }
    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/api/products`);
    }
    getManyByIds(ids: string[]): Observable<Product[]> {
        const params = new HttpParams().set('ids', ids.join(','));
        return this.http.get<Product[]>(`${this.baseUrl}/api/wishlist/local`, { params });
    }

    createProduct(product: CreateProductDTO, file?: File): Observable<Product> {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (file) formData.append('image', file);

        return this.http.post<Product>(`${this.baseUrl}/api/products`, formData);
    }

    updateProduct(id: string, product: UpdateProductDTO, file?: File): Observable<Product> {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (file) formData.append('image', file);

        return this.http.put<Product>(`${this.baseUrl}/api/products/${id}`, formData);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/api/products/${id}`);
    }

    getCategories() {
        return this.http.get<{name:string , slug:string, _id:string}[]>(`${this.baseUrl}/categories`);
    }
}
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../shared/models/product.model";
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
        return this.http.get<Paged<Product>>(`${this.baseUrl}/api/catalogs/products`, { params });
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/api/products/${id}`);
    }

    getManyByIds(ids: string[]): Observable<Product[]> {
        const params = new HttpParams().set('ids', ids.join(','));
        return this.http.get<Product[]>(`${this.baseUrl}/api/wishlist/local`, { params });
    }

    getCategories() {
        return this.http.get<{name:string , slug:string}[]>(`${this.baseUrl}/api/categories`);
    }
}
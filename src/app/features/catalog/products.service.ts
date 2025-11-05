import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../shared/models/product.model";
import { BaseHttpService } from "../../core/http/base-http.service";

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseHttpService {
    private productsEndpoint = `${this.baseUrl}/api/catalogs/products`;

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productsEndpoint);
    }

    
}
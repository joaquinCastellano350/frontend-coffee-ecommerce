import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    private baseUrl = 'http://localhost:3000/api/categories';
    constructor(private http: HttpClient) {}

    createCategory(name: string) {
        return this.http.post<{name:string, slug:string, _id:string}>(`${this.baseUrl}`, {name});
    }
}
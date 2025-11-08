import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class CatalogsService {
    private baseUrl = 'http://localhost:3000/api/catalogs';
    constructor(private http: HttpClient) {}

    getCatalogs() {
        return this.http.get<{name:string , slug:string, _id:string, visible:boolean}[]>(`${this.baseUrl}`);
    }

    createCatalog(name: string, visible: boolean = false) {
        return this.http.post<{name:string, slug:string, _id:string, visible:boolean}>(`${this.baseUrl}`, {name, visible});
    }

    enableCatalog(id: string) {
        return this.http.patch<{name:string, slug:string, _id:string, visible:boolean}>(`${this.baseUrl}/id/${id}/enable`, {});
    }
}

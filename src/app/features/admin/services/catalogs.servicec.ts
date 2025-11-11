import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { BaseHttpService } from "../../../core/http/base-http.service";

@Injectable({ providedIn: 'root' })
export class CatalogsService extends BaseHttpService {
    

    getCatalogs() {
        return this.http.get<{name:string , slug:string, _id:string, visible:boolean}[]>(`${this.baseUrl}/catalogs`);
    }

    createCatalog(name: string, visible: boolean = false) {
        return this.http.post<{name:string, slug:string, _id:string, visible:boolean}>(`${this.baseUrl}/catalogs`, {name, visible});
    }

    enableCatalog(id: string) {
        return this.http.patch<{name:string, slug:string, _id:string, visible:boolean}>(`${this.baseUrl}/catalogs/id/${id}/enable`, {});
    }
}

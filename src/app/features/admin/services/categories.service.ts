import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { BaseHttpService } from "../../../core/http/base-http.service";

@Injectable({ providedIn: 'root' })
export class CategoriesService extends BaseHttpService {
    createCategory(name: string) {
        return this.http.post<{name:string, slug:string, _id:string}>(`${this.baseUrl}/categories`, {name});
    }
}
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/http/base-http.service';
import { Catalog, CreateCatalogDTO } from '../../../shared/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogsService extends BaseHttpService {
  getCatalogs() {
    return this.http.get<Catalog[]>(`${this.baseUrl}/catalogs`);
  }

  createCatalog(catalog: CreateCatalogDTO) {
    const formData = new FormData();
    Object.entries(catalog).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    return this.http.post<Catalog>(`${this.baseUrl}/catalogs`, catalog, { withCredentials: true });
  }
  updateCatalog(id: string, catalog: Partial<CreateCatalogDTO>) {
    const formData = new FormData();
    Object.entries(catalog).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    return this.http.put<Catalog>(`${this.baseUrl}/catalogs/id/${id}`, catalog, {
      withCredentials: true,
    });
  }

  enableCatalog(id: string) {
    return this.http.patch<{ name: string; slug: string; _id: string; visible: boolean }>(
      `${this.baseUrl}/catalogs/id/${id}/enable`,
      {},
      { withCredentials: true },
    );
  }
  disableCatalog(id: string) {
    return this.http.patch<{ name: string; slug: string; _id: string; visible: boolean }>(
      `${this.baseUrl}/catalogs/id/${id}/disable`,
      {},
      { withCredentials: true },
    );
  }
  getCatalogById(id: string) {
    return this.http.get<Partial<Catalog>>(`${this.baseUrl}/catalogs/id/${id}`);
  }
}

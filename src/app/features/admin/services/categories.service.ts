import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/http/base-http.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends BaseHttpService {
  createCategory(name: string) {
    return this.http.post<{ name: string; slug: string; _id: string }>(
      `${this.baseUrl}/categories`,
      { name },
    );
  }

  getAllCategories() {
    return this.http.get<{ name: string; slug: string; _id: string }[]>(
      `${this.baseUrl}/categories`
    );
  }

  getCategoryById(id: string) {
    return this.http.get<{ name: string; slug: string; _id: string }>(
      `${this.baseUrl}/categories/${id}`
    );
  }

  updateCategory(id: string, name: string) {
    return this.http.put<{ name: string; slug: string; _id: string }>(
      `${this.baseUrl}/categories/${id}`,
      { name }
    );
  }

  deleteCategory(id: string) {
    return this.http.delete<void>(
      `${this.baseUrl}/categories/${id}`
    );
  }
}


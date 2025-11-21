import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/http/base-http.service';
import { CountedProductDTO } from '../../../shared/models/product.model';
import { InterestForm } from '../../catalog/components/interest-form/interest-form';

@Injectable({ providedIn: 'root' })
export class StatsService extends BaseHttpService {
  countLatestsForms() {
    return this.http.get<{ total: number }>(`/api/forms/latests`, { withCredentials: true });
  }
  countActiveProducts() {
    return this.http.get<{ total: number }>('/api/products/count', { withCredentials: true });
  }
  countWishedProducts() {
    return this.http.get<{ total: number }>('/auth/users/wishlist/count', {
      withCredentials: true,
    });
  }
  findActiveCatalog() {
    return this.http.get<{ name: string }>('/api/catalogs/active', { withCredentials: true });
  }
  findMostAsked() {
    return this.http.get<Partial<CountedProductDTO>[]>('/api/forms/products', {
      withCredentials: true,
    });
  }
  findMostFaved() {
    return this.http.get<Partial<CountedProductDTO>[]>('/auth/users/wishlist/favorites', {
      withCredentials: true,
    });
  }
  findLatestsForms() {
    return this.http.get<Partial<InterestForm>[]>('/api/forms', {
      params: { limit: 5 },
      withCredentials: true,
    });
  }
}

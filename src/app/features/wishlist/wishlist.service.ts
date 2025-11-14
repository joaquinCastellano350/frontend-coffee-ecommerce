import { effect, inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { BaseHttpService } from '../../core/http/base-http.service';
import { AuthService } from '../auth/auth.services';

@Injectable({
  providedIn: 'root',
})
export class WishlistService extends BaseHttpService {
  private auth = inject(AuthService);
  private _wishlist = signal<string[]>(this.restoreLocal());

  constructor() {
    super();
    let hasSynced = false;
    effect(() => {
      const user = this.auth.user();
      const loading = this.auth.loading();
      if (loading) return;

      if (user && !hasSynced) {
        hasSynced = true;
        this.syncAfterLogin().catch(() => {});
      }

      if (!user && hasSynced) {
        this.clear();
        hasSynced = false;
      }
    });
  }

  toggle(productId: string) {
    const set = new Set(this._wishlist());
    if (set.has(productId)) {
      set.delete(productId);
      if (this.auth.isLoggedIn()) {
        this.deleteOne(productId);
      }
    } else {
      set.add(productId);
      if (this.auth.isLoggedIn()) {
        this.persistOne(productId);
      }
    }
    this._wishlist.set([...set]);
    this.persistLocal();
  }

  has(productId: string) {
    return this._wishlist().includes(productId);
  }

  clear() {
    this._wishlist.set([]);
    this.persistLocal();
  }

  getItems() {
    return [...this._wishlist()];
  }

  private restoreLocal(): string[] {
    try {
      const data = localStorage.getItem('wishlist');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private persistLocal() {
    localStorage.setItem('wishlist', JSON.stringify(this._wishlist()));
  }

  private async getServer(): Promise<string[] | undefined> {
    const r = await this.http.get<string[]>('/api/wishlist', { withCredentials: true }).toPromise();
    return r;
  }

  private async mergeServer() {
    return await this.http
      .post('/api/wishlist/merge', { productsIds: this._wishlist() }, { withCredentials: true })
      .toPromise();
  }

  private async persistOne(productId: string) {
    return this.http.post(`/api/wishlist/` + productId, {}, { withCredentials: true }).toPromise();
  }

  private async deleteOne(productId: string) {
    return this.http.delete('/api/wishlist/' + productId).toPromise();
  }

  async syncAfterLogin() {
    await this.mergeServer().finally(async () => {
      const res = (await this.getServer()) || [];
      this._wishlist.set(res);
      this.persistLocal();
    });
  }
}

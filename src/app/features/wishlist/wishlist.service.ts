import { Injectable } from "@angular/core";
import { signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  private _wishlist = signal<string[]>(this.restoreLocal());

  wishlist = this._wishlist.asReadonly();

  constructor() {
    
  }

  toggle(productId: string) {
    const set = new Set(this._wishlist());
    set.has(productId) ? set.delete(productId) : set.add(productId);
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
}

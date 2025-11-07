import { Routes } from '@angular/router';
import { ProductsList } from './features/catalog/pages/products-list/products-list';
import { ProductDetail } from './features/catalog/pages/product-detail/product-detail';
import { WishlistPage } from './features/wishlist/pages/wishlist-page/wishlist-page';

export const routes: Routes = [
    { path: '', component: ProductsList },
    {path: 'product/:id', component:ProductDetail},
    {path: 'wishlist', component:WishlistPage},
    {path:'**', redirectTo:''}
];

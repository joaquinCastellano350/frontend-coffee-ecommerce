import { Routes } from '@angular/router';
import { ProductsList } from './features/catalog/pages/products-list/products-list';
import { ProductDetail } from './features/catalog/pages/product-detail/product-detail';
import { WishlistPage } from './features/wishlist/pages/wishlist-page/wishlist-page';
import { LoginPage } from './features/auth/login/login.page';

export const routes: Routes = [
    { path: '', component: ProductsList },
    {path: 'product/:id', component:ProductDetail},
    {path: 'wishlist', component:WishlistPage},
    {path:'**', redirectTo:''},
    {path: 'login', component:LoginPage , data: {mode: 'login'}},
    {path: 'register', component:LoginPage , data: {mode: 'register'}},
    {path:'**', redirectTo:''},
    { path: '', redirectTo: '/catalog', pathMatch: 'full' }
];


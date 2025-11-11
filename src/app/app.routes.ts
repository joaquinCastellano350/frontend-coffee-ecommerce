import { Routes } from '@angular/router';
import { ProductsList } from './features/catalog/pages/products-list/products-list';
import { ProductDetail } from './features/catalog/pages/product-detail/product-detail';
import { WishlistPage } from './features/wishlist/pages/wishlist-page/wishlist-page';
import { LoginPage } from './features/auth/login/login.page';
import { AdminProductsList } from './features/admin/pages/admin-products-list/admin-products-list';
import { AdminProductForm } from './features/admin/pages/admin-product-form/admin-product-form';

export const routes: Routes = [
    { path: '', component: ProductsList },
    {path: 'product/:id', component:ProductDetail},
    {path: 'wishlist', component:WishlistPage},
    {path: 'login', component:LoginPage , data: {mode: 'login'}},
    {path: 'register', component:LoginPage , data: {mode: 'register'}},
    {path: 'admin/products', component:AdminProductsList},
    {path: 'admin/products/new', component: AdminProductForm},
    {path: 'admin/products/edit/:id', component: AdminProductForm},
    {path:'**', redirectTo:''}
];


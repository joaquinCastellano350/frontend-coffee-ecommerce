import { Routes } from '@angular/router';
import { ProductsList } from './features/catalog/pages/products-list/products-list';
import { ProductDetail } from './features/catalog/pages/product-detail/product-detail';
import { WishlistPage } from './features/wishlist/pages/wishlist-page/wishlist-page';
import { LoginPage } from './features/auth/login/login.page';
import { AdminProductsList } from './features/admin/pages/admin-products-list/admin-products-list';
import { AdminProductForm } from './features/admin/pages/admin-product-form/admin-product-form';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';
import { AdminFormsList } from './features/admin/pages/admin-forms-list/admin-forms-list';

export const routes: Routes = [
    { path: '', component: ProductsList },
    {path: 'product/:id', component:ProductDetail},
    {path: 'wishlist', component:WishlistPage},
    {path: 'login', component:LoginPage , data: {mode: 'login'}},
    {path: 'register', component:LoginPage , data: {mode: 'register'}},
    {path: 'admin',
        canMatch: [authGuard, adminGuard],
        children: [
            {path: 'forms', component:AdminFormsList},
            {path: 'products', component:AdminProductsList},
            {path: 'products/new', component: AdminProductForm},
            {path: 'products/edit/:id', component: AdminProductForm},
        ]
    },
    {path:'**', redirectTo:''}
];


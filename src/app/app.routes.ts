import { Routes } from '@angular/router';
import { ProductsList } from './features/catalog/pages/products-list/products-list';
import { ProductDetail } from './features/catalog/pages/product-detail/product-detail';

export const routes: Routes = [
    { path: '', component: ProductsList },
    {path: 'product/:id', component:ProductDetail},
    {path:'**', redirectTo:''}
];

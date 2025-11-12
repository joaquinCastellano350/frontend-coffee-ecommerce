import { Component, inject, signal } from '@angular/core';
import { ProductsService, Paged } from '../../products.service';
import { Product } from '../../../../shared/models/product.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgFor } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../../wishlist/wishlist.service';
import { ProductListComponent } from '../../components/product-list-component/product-list-component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InterestForm } from '../../components/interest-form/interest-form';
@Component({
  selector: 'app-products-list',
  imports: [CommonModule, NgFor, MatCardModule, MatButton, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, RouterLink, ProductListComponent],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  private service = inject(ProductsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  wishlist = inject(WishlistService);
  
  products = signal<Product[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  loading = signal(true);
  categories = signal<{name:string , slug:string, _id:string}[]>([]);


  filters = this.fb.group({
    category: [''],
    brand: [''],
    name: [''],
  });

  constructor(private dialog: MatDialog, private snack: MatSnackBar) {
    this.service.getCategories().subscribe((cats) => {
      this.categories.set(cats);
    });
    const queryParams = this.route.snapshot.queryParamMap;
    this.filters.patchValue({
      category: queryParams.get('category') || '',
      brand: queryParams.get('brand') || '',
      name: queryParams.get('name') || '',
    }, {emitEvent: false});
    this.page.set(
      +(queryParams.get('page') || '1')
    )
    this.limit.set(+(queryParams.get('limit') || '10')) 
    ;

    this.filters.valueChanges.pipe(debounceTime(250)).subscribe(v => {
      this.page.set(1);
      
      this.router.navigate([], {
        queryParams: {
          ...v,
          page: this.page(),
          limit: this.limit()
        }, queryParamsHandling: 'merge'
      });
      this.fetch();
    });
    
    this.fetch();
  }


  fetch() {
    this.loading.set(true);
    const {category , brand , name} = this.filters.value;
    this.service.getProducts({
      category: category || undefined, brand: brand || undefined , name: name || undefined,
      page: this.page(), limit : this.limit()
    }).subscribe((res : Paged<Product>) => {
      this.products.set(res.products);
      this.total.set(res.total);
      this.loading.set(false);
    })
  }

    openForm(){
    const ref = this.dialog.open(InterestForm);
    ref.afterClosed().subscribe(ok => {
      if (ok) this.snack.open('Gracias! Te contactaremos pronto.', 'Cerrar', {duration: 3000})
    })
  }


  goPage(n: number) {
    if (n < 1) return;
    this.page.set(n);
    this.router.navigate([], {queryParams: {page: n}, queryParamsHandling: 'merge'});
    this.fetch();
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogForm } from './admin-catalog-form';

describe('AdminCatalogForm', () => {
  let component: AdminCatalogForm;
  let fixture: ComponentFixture<AdminCatalogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoriesList } from './admin-category-list';

describe('AdminCategoryList', () => {
  let component: AdminCategoriesList;
  let fixture: ComponentFixture<AdminCategoriesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoriesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoriesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

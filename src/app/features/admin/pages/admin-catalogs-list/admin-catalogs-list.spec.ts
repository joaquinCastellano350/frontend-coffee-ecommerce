import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogsList } from './admin-catalogs-list';

describe('AdminCatalogsList', () => {
  let component: AdminCatalogsList;
  let fixture: ComponentFixture<AdminCatalogsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

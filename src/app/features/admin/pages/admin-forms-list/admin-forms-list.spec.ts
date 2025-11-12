import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormsList } from './admin-forms-list';

describe('AdminFormsList', () => {
  let component: AdminFormsList;
  let fixture: ComponentFixture<AdminFormsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFormsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFormsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

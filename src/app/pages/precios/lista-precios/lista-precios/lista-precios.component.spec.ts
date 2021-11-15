import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreciosComponent } from './lista-precios.component';

describe('ListaPreciosComponent', () => {
  let component: ListaPreciosComponent;
  let fixture: ComponentFixture<ListaPreciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPreciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

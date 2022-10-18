import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarPreciosComponent } from './actualizar-precios.component';

describe('ActualizarPreciosComponent', () => {
  let component: ActualizarPreciosComponent;
  let fixture: ComponentFixture<ActualizarPreciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarPreciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

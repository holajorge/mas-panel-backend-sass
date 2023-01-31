import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosPedidosComponent } from './estados-pedidos.component';

describe('EstadosPedidosComponent', () => {
  let component: EstadosPedidosComponent;
  let fixture: ComponentFixture<EstadosPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

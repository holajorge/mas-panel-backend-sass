import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarDolarComponent } from './actualizar-dolar.component';

describe('ActualizarDolarComponent', () => {
  let component: ActualizarDolarComponent;
  let fixture: ComponentFixture<ActualizarDolarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarDolarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarDolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

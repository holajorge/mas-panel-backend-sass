import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialProductosImportacionComponent } from './historial-productos-importacion.component';

describe('HistorialProductosImportacionComponent', () => {
  let component: HistorialProductosImportacionComponent;
  let fixture: ComponentFixture<HistorialProductosImportacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialProductosImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialProductosImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

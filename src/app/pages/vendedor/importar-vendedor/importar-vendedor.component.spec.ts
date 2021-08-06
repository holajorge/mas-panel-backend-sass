import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarVendedorComponent } from './importar-vendedor.component';

describe('ImportarVendedorComponent', () => {
  let component: ImportarVendedorComponent;
  let fixture: ComponentFixture<ImportarVendedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarVendedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

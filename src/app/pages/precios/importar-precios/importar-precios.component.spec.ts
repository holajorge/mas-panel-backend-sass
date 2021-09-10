import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarPreciosComponent } from './importar-precios.component';

describe('ImportarPreciosComponent', () => {
  let component: ImportarPreciosComponent;
  let fixture: ComponentFixture<ImportarPreciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarPreciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

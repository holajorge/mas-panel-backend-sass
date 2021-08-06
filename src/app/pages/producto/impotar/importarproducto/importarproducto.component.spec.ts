import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarproductoComponent } from './importarproducto.component';

describe('ImportarproductoComponent', () => {
  let component: ImportarproductoComponent;
  let fixture: ComponentFixture<ImportarproductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarproductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

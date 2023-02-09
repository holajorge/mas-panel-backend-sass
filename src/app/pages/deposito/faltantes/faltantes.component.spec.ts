import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaltantesComponent } from './faltantes.component';

describe('FaltantesComponent', () => {
  let component: FaltantesComponent;
  let fixture: ComponentFixture<FaltantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaltantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaltantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

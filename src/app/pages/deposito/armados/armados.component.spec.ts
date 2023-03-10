import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmadosComponent } from './armados.component';

describe('ArmadosComponent', () => {
  let component: ArmadosComponent;
  let fixture: ComponentFixture<ArmadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

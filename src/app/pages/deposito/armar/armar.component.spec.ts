import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmarComponent } from './armar.component';

describe('ArmarComponent', () => {
  let component: ArmarComponent;
  let fixture: ComponentFixture<ArmarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

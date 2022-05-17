import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { NavbarSuperComponent } from './navbar_super.component';

describe('NavbarSuperComponent', () => {
  let component: NavbarSuperComponent;
  let fixture: ComponentFixture<NavbarSuperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarSuperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSuperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

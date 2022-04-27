import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarSuperComponent } from './sidebar_super.component';



describe('SidebarAdminComponent', () => {
  let component: SidebarSuperComponent;
  let fixture: ComponentFixture<SidebarSuperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarSuperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSuperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

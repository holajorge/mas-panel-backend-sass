import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { SidebarAdminComponent } from "./sidebar_admin/sidebar_admin.component";
import { SidebarSuperComponent } from "./sidebar_super/sidebar_super.component";
import { NavbarAdminComponent } from "./navbar_admin/navbar_admin.component";
import { NavbarSuperComponent } from "./navbar_super/navbar_super.component";
import { FooterAdminComponent } from "./footer_admin/footer_admin.component";
import { VectorMapComponent1 } from "./vector-map/vector-map.component";

import { RouterModule } from "@angular/router";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { DxVectorMapModule } from "devextreme-angular";
import { BsDropdownModule } from "ngx-bootstrap";
import {BdcWalkModule} from 'bdc-walkthrough';
import { TaskmanagerComponent } from './taskmanager/taskmanager.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CollapseModule.forRoot(),
    DxVectorMapModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    BdcWalkModule
  ],
  declarations: [
    VectorMapComponent1,
    SidebarAdminComponent,SidebarSuperComponent,
    NavbarAdminComponent,NavbarSuperComponent,
    FooterAdminComponent,
    TaskmanagerComponent
  ],
  exports: [
    VectorMapComponent1,
    SidebarAdminComponent,SidebarSuperComponent,
    NavbarAdminComponent,NavbarSuperComponent,
    FooterAdminComponent,
    TaskmanagerComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ComponentsModule {}

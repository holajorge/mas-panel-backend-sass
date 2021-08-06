import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AuthRoutingModule } from "./auth/auth.routing";
import { PagesRoutingModule } from "./pages/pages.routing";


const routes: Routes = [
  {path: "",redirectTo: "admin",pathMatch: "full"},  
  // {path: "**",redirectTo: "dashboard"}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    PagesRoutingModule,
    AuthRoutingModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

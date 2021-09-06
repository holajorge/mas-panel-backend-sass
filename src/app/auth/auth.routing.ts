import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ClaveComponent } from './clave/clave.component';

export const routes: Routes = [
    {path:'login', component: LoginComponent},
    {path:'clave', component: ClaveComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
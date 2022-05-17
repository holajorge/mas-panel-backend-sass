import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ClaveComponent } from './clave/clave.component';
import { RegistracionComponent } from './registracion/registracion.component';
import { LoginSuperComponent } from '../pages/super-admin/login-super/login-super.component';

export const routes: Routes = [
    {path:'login', component: LoginComponent},
    {path:'back/login', component: LoginSuperComponent},
    {path:'clave', component: ClaveComponent},
    {path:'registracion', component: RegistracionComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
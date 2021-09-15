import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ClaveComponent } from './clave/clave.component';
import { RegistracionComponent } from './registracion/registracion.component';

export const routes: Routes = [
    {path:'login', component: LoginComponent},
    {path:'clave', component: ClaveComponent},
    {path:'registracion', component: RegistracionComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
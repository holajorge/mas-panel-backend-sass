import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { ClaveComponent } from './clave/clave.component';
import { RegistracionComponent } from './registracion/registracion.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    LoginComponent,
    ClaveComponent,
    RegistracionComponent
  ],
  exports: [
    LoginComponent,
    RegistracionComponent
  ],
  imports: [    
    CommonModule,
    FormsModule,ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
  ]
})
export class AuthModule { }

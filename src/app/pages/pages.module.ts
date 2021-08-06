import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ComponentsModule } from '../components/components.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from '../layouts/admin/admin.component';
import { VendedorComponent } from './vendedor/vendedor.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { BannerComponent } from './banner/banner.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ImportarComponent } from './cliente/importar/importar.component';
import { ProductoComponent } from './producto/producto.component';
import { ImportarproductoComponent } from './producto/impotar/importarproducto/importarproducto.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { ImportarVendedorComponent } from './vendedor/importar-vendedor/importar-vendedor.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AdminComponent,
    VendedorComponent,
    PedidosComponent,
    BannerComponent,
    ClienteComponent,
    ImportarComponent,
    ProductoComponent,
    ImportarproductoComponent,
    ConfiguracionesComponent,
    ImportarVendedorComponent
  ],
  imports: [
    FormsModule,ReactiveFormsModule,
    NgbModule,
    CommonModule,
    ComponentsModule,
    AppRoutingModule,
    NgxDatatableModule,
    ColorPickerModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
  ],
  exports: [
    AdminComponent,
    VendedorComponent,
    PedidosComponent,
    BannerComponent,
    ClienteComponent,
    ImportarComponent,
    ProductoComponent,
    ImportarproductoComponent,
    FormsModule,ReactiveFormsModule,
   
  ],
  

})
export class PagesModule { }

import { LOCALE_ID,NgModule } from '@angular/core';
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
import { AngularEditorModule } from '@kolkov/angular-editor';
import {DpDatePickerModule} from 'ng2-date-picker';
import {PipesModule} from '../pipes/pipes.module';

import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeEs, 'es'); 

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
import { ImportarFotosComponent } from './producto/importar-fotos/importar-fotos.component';
import { ConfigurcionProductoComponent } from './producto/configurcion-producto/configurcion-producto.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { PreciosComponent } from './precios/precios.component';
import { ImportarPreciosComponent } from './precios/importar-precios/importar-precios.component';
import { DominioComponent } from './configuraciones/dominio/dominio.component';
import { GeneralComponent } from './configuraciones/general/general.component';
import { ClientesComponent } from './pedidos/clientes/clientes.component';
import { AgregarComponent } from './cliente/agregar/agregar.component';
import { ListaComponent } from './cliente/lista/lista.component';
import { DescuentoComponent } from './precios/descuento/descuento.component';
import { DescuentoListaComponent } from './precios/descuento-lista/descuento-lista.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ImportarCategoriaComponent } from './categorias/importar-categoria/importar-categoria.component';
import { MicuentaComponent } from './micuenta/micuenta.component';
import {BdcWalkModule} from 'bdc-walkthrough';
import { ListaPreciosComponent } from './precios/lista-precios/lista-precios/lista-precios.component';
import { TareasComponent } from './tareas/tareas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImportarDescuentoComponent } from './precios/importar-descuento/importar-descuento.component';
import { ImportarSucursalesComponent } from './cliente/importar-sucursales/importar-sucursales.component';
import { ListaPComponent } from './precios/lista/listaP.component';
import { StockPrecioComponent } from './precios/stock-precio/stock-precio.component';
import { LoginSuperComponent } from './super-admin/login-super/login-super.component';
import { HomeSuperComponent } from './super-admin/home-super/home-super.component';
import { EmpresasComponent } from './super-admin/empresas/empresas.component'
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TutorialesComponent } from './tutoriales/tutoriales.component'
import {MatIconModule} from '@angular/material/icon';
import { TapiceComponent } from './tapice/tapice.component';
import { LoginPartnerComponent } from './partners/login-partner/login-partner.component';
import { RegistracionPartnerComponent } from './partners/registracion-partner/registracion-partner.component'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
imports: [
  ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
]

@NgModule({
  providers: [{provide:LOCALE_ID, useValue: 'es'}],
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
    ImportarVendedorComponent,
    ImportarFotosComponent,
    ConfigurcionProductoComponent,
    PreciosComponent,
    ImportarPreciosComponent,
    DominioComponent,
    GeneralComponent,
    ClientesComponent,
    AgregarComponent,
    ListaComponent,
    DescuentoComponent,
    DescuentoListaComponent,
    CategoriasComponent,
    ImportarCategoriaComponent,
    MicuentaComponent,
    ListaPreciosComponent,ListaPComponent,
    TareasComponent,
    DashboardComponent,
    ImportarDescuentoComponent,
    ImportarSucursalesComponent,
    StockPrecioComponent,
    LoginSuperComponent,
    HomeSuperComponent,
    EmpresasComponent,
    TutorialesComponent,
    TapiceComponent,
    LoginPartnerComponent,
    RegistracionPartnerComponent
  ],
  imports: [
    DpDatePickerModule,MatMenuModule,MatButtonModule,MatIconModule,
    FormsModule,ReactiveFormsModule,NgSelectModule,
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
    AngularEditorModule,
    BdcWalkModule,
    PipesModule
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

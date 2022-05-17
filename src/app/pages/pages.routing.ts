import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { AuthGuard } from '../guards/auth.guard';

import { AdminComponent } from '../layouts/admin/admin.component';
import { SuperComponent } from '../layouts/super/super.component';

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
import { PreciosComponent } from './precios/precios.component';
import { ImportarPreciosComponent } from './precios/importar-precios/importar-precios.component';
import { DominioComponent } from './configuraciones/dominio/dominio.component';
import { GeneralComponent } from './configuraciones/general/general.component';
import { ClientesComponent } from './pedidos/clientes/clientes.component';
import { AgregarComponent } from './cliente/agregar/agregar.component'
import { ListaComponent } from './cliente/lista/lista.component'
import { ListaPComponent } from './precios/lista/listaP.component'
import { DescuentoComponent } from './precios/descuento/descuento.component';
import { DescuentoListaComponent } from './precios/descuento-lista/descuento-lista.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ImportarCategoriaComponent } from './categorias/importar-categoria/importar-categoria.component';
import { MicuentaComponent } from './micuenta/micuenta.component';
import { ListaPreciosComponent } from './precios/lista-precios/lista-precios/lista-precios.component';
import { TareasComponent } from './tareas/tareas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImportarDescuentoComponent } from './precios/importar-descuento/importar-descuento.component';
import { ImportarSucursalesComponent } from './cliente/importar-sucursales/importar-sucursales.component';
import { StockPrecioComponent } from './precios/stock-precio/stock-precio.component';
//super admin
import { LoginSuperComponent } from './super-admin/login-super/login-super.component';
import { SuperGuard } from '../guards/super.guard';
import { HomeSuperComponent } from './super-admin/home-super/home-super.component';
import { EmpresasComponent } from './super-admin/empresas/empresas.component';


const routes:Routes = [
    {
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [ 
            {path:'', component: ClientesComponent},
            //MI CUENTA
            // empresa
            {path: 'cuenta/datos', component: MicuentaComponent},
            {path: 'cuenta/pagos', component: MicuentaComponent},

            // empresa
            {path: 'configuraciones/empresa', component: ConfiguracionesComponent},
            {path: 'configuraciones/dominios', component: DominioComponent},
            {path: 'configuraciones/general', component: GeneralComponent},

            {path:'pedidos/vendedores', component: PedidosComponent},
            {path:'pedidos/clientes', component: ClientesComponent},
            
            {path:'banners', component: BannerComponent},
            //vendedores
            {path:'vendedor/vendedores', component: VendedorComponent}, 
            {path:'vendedor/importarVendedor', component: ImportarVendedorComponent}, 
            // clientes
            {path: 'cliente/clientes',  component: ClienteComponent},
            {path: 'cliente/importar',  component: ImportarComponent},
            {path: 'cliente/importar-sucursales',  component: ImportarSucursalesComponent},
            // {path: 'cliente/agregar-comprobante',  component: AgregarComponent},
            {path: 'cliente/lista-comprobante',  component: ListaComponent},
            //categorias
            {path: 'producto/permisos',  component: CategoriasComponent},
            {path: 'producto/importar-permisos',  component: ImportarCategoriaComponent},
            //productos
            {path: 'producto/configuracion',  component: ConfigurcionProductoComponent},
            {path: 'producto/productos',  component: ProductoComponent},
            {path: 'producto/importarproducto',  component: ImportarproductoComponent},
            {path: 'producto/importarfotos',  component: ImportarFotosComponent},
            //precios
            {path: 'precios/lista-precios',  component: ListaPComponent},
            {path: 'precios/importar-precios',  component: ImportarPreciosComponent},
            {path: 'precios/importar-descuentos',  component: ImportarDescuentoComponent},
            {path: 'precios/descuento-categorias',  component: DescuentoComponent},
            {path: 'precios/descuento-lista',  component: DescuentoListaComponent},
            {path: 'precios/importar-lista-precios',  component: ListaPreciosComponent},
            {path: 'precios/stock-precio',  component: StockPrecioComponent},

            //tarea
            {path: 'tareas', component:TareasComponent},

            // admin
            {path: 'admin/dashboard', component: DashboardComponent}
            
        ]
    },
    {
        path: 'back', 
        component: SuperComponent,
        canActivate: [SuperGuard],
        children: [
            {path:'', component: HomeSuperComponent},
            {path:'empresas', component: EmpresasComponent},
        ]
    }       

];

@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]
})
export class PagesRoutingModule {}
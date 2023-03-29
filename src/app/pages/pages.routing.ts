import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { AuthGuard } from '../guards/auth.guard';
import { PermisosGuard } from '../guards/permisos.guard';

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
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ImportarDescuentoComponent } from './precios/importar-descuento/importar-descuento.component';
import { ImportarSucursalesComponent } from './cliente/importar-sucursales/importar-sucursales.component';
import { StockPrecioComponent } from './precios/stock-precio/stock-precio.component';
import { ActualizarPreciosComponent } from './precios/actualizar-precios/actualizar-precios.component';
//super admin
import { LoginSuperComponent } from './super-admin/login-super/login-super.component';
import { SuperGuard } from '../guards/super.guard';
import { HomeSuperComponent } from './super-admin/home-super/home-super.component';
import { EmpresasComponent } from './super-admin/empresas/empresas.component';
import { TapiceComponent } from './tapice/tapice.component';

import { TutorialesComponent } from './tutoriales/tutoriales.component';
import { GaleriaFotosComponent } from './producto/galeria-fotos/galeria-fotos.component';
import { AfiliadosComponent } from './super-admin/afiliados/afiliados.component';
import { ActualizarDolarComponent } from './precios/actualizar-dolar/actualizar-dolar.component';
import { ArmarComponent } from './deposito/armar/armar.component';
import { FaltantesComponent } from './deposito/faltantes/faltantes.component';
import { ArmadosComponent } from './deposito/armados/armados.component';
import { PagosComponent } from './pagos/pagos.component'
import { EstadosPedidosComponent } from './estados-pedidos/estados-pedidos.component';

const routes:Routes = [
    {
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [ 
            {path:'', component: ClientesComponent,canActivate: [PermisosGuard]},
            //MI CUENTA
            // empresa
            {path: 'cuenta/datos', component: MicuentaComponent},
            {path: 'cuenta/pagos', component: MicuentaComponent},

            // empresa
            {path: 'configuraciones/empresa', component: ConfiguracionesComponent, canActivate: [PermisosGuard]},
            {path: 'configuraciones/dominios', component: DominioComponent,canActivate: [PermisosGuard]},
            {path: 'configuraciones/general', component: GeneralComponent,canActivate: [PermisosGuard]},
            {path: 'configuraciones/estados', component: EstadosPedidosComponent},

            {path:'pedidos/vendedores', component: PedidosComponent, canActivate: [PermisosGuard]},
            {path:'pedidos/clientes', component: ClientesComponent, canActivate: [PermisosGuard]},
            
            {path:'deposito/armar', component: ArmarComponent, canActivate: [PermisosGuard]},
            {path:'deposito/faltantes', component: FaltantesComponent, canActivate: [PermisosGuard]},
            {path:'deposito/armados', component: ArmadosComponent, canActivate: [PermisosGuard]},

            {path:'banners', component: BannerComponent,canActivate: [PermisosGuard]},
            //vendedores
            {path:'vendedor/vendedores', component: VendedorComponent,canActivate: [PermisosGuard]}, 
            {path:'vendedor/importarVendedor', component: ImportarVendedorComponent,canActivate: [PermisosGuard]}, 
            // clientes
            {path: 'cliente/clientes',  component: ClienteComponent, canActivate: [PermisosGuard]},
            {path: 'cliente/importar',  component: ImportarComponent, canActivate: [PermisosGuard]},
            {path: 'cliente/importar-sucursales',  component: ImportarSucursalesComponent, canActivate: [PermisosGuard]},
            // {path: 'cliente/agregar-comprobante',  component: AgregarComponent},
            {path: 'cliente/lista-comprobante',  component: ListaComponent, canActivate: [PermisosGuard]},
            //categorias
            {path: 'producto/permisos',  component: CategoriasComponent, canActivate: [PermisosGuard]},
            {path: 'producto/importar-permisos',  component: ImportarCategoriaComponent, canActivate: [PermisosGuard]},
            //productos
            {path: 'producto/configuracion',  component: ConfigurcionProductoComponent,canActivate: [PermisosGuard]},
            {path: 'producto/productos',  component: ProductoComponent,canActivate: [PermisosGuard]},
            {path: 'producto/importarproducto',  component: ImportarproductoComponent,canActivate: [PermisosGuard]},
            {path: 'producto/importarfotos',  component: ImportarFotosComponent,canActivate: [PermisosGuard]},
            {path: 'producto/galeriafotos',  component: GaleriaFotosComponent,canActivate: [PermisosGuard]},
            //precios
            {path: 'precios/lista-precios',  component: ListaPComponent,canActivate: [PermisosGuard]},
            {path: 'precios/importar-precios',  component: ImportarPreciosComponent,canActivate: [PermisosGuard]},
            {path: 'precios/importar-descuentos',  component: ImportarDescuentoComponent,canActivate: [PermisosGuard]},
            {path: 'precios/descuento-categorias',  component: DescuentoComponent,canActivate: [PermisosGuard]},
            {path: 'precios/descuento-lista/:type',  component: DescuentoListaComponent,canActivate: [PermisosGuard]},
            {path: 'precios/importar-lista-precios',  component: ListaPreciosComponent,canActivate: [PermisosGuard]},
            {path: 'precios/stock-precio',  component: StockPrecioComponent,canActivate: [PermisosGuard]},
            {path: 'precios/actualizar-precios',  component: ActualizarPreciosComponent,canActivate: [PermisosGuard]},
            {path: 'precios/actualizar-dolar', component: ActualizarDolarComponent, canActivate: [PermisosGuard]},
            {path: 'tapice',  component: TapiceComponent,canActivate: [PermisosGuard]},

            //tutoriales
            {path:'tutoriales', component: TutorialesComponent},

            //tarea
            {path: 'tareas', component:TareasComponent},

            // admin
            {path: 'admin/dashboard', component: DashboardComponent,canActivate: [PermisosGuard]},

            // usuarios
            {path: 'usuarios', component: UsuariosComponent,canActivate: [PermisosGuard]},
            {path: 'admin/dashboard', component: DashboardComponent},

            //métodos de pagos
            {path:'payments', component: PagosComponent},
            
        ]
    },
    {
        path: 'back', 
        component: SuperComponent,
        canActivate: [SuperGuard],
        children: [
            {path:'', component: HomeSuperComponent},
            {path:'empresas', component: EmpresasComponent},
            {path:'afiliados', component: AfiliadosComponent},
        ]
    }       

];

@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]
})
export class PagesRoutingModule {}
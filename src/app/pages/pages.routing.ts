import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";
import { AuthGuard } from '../guards/auth.guard';

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

import { PreciosComponent } from './precios/precios.component';
import { ImportarPreciosComponent } from './precios/importar-precios/importar-precios.component';

const routes:Routes = [
    {
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [            
            {path:'', component: PedidosComponent},
            {path: 'configuraciones', component: ConfiguracionesComponent},
            {path:'pedidos', component: PedidosComponent},
            {path:'banners', component: BannerComponent},
            //vendedores
            {path:'vendedor/vendedores', component: VendedorComponent}, 
            {path:'vendedor/importarVendedor', component: ImportarVendedorComponent}, 
            // clientes
            {path: 'cliente/clientes',  component: ClienteComponent},
            {path: 'cliente/importar',  component: ImportarComponent},
            //productos
            {path: 'producto/configuracion',  component: ConfigurcionProductoComponent},
            {path: 'producto/productos',  component: ProductoComponent},
            {path: 'producto/importarproducto',  component: ImportarproductoComponent},
            {path: 'producto/importarfotos',  component: ImportarFotosComponent},
            //precios
            {path: 'precios/lista',  component: PreciosComponent},
            {path: 'precios/importar-precios',  component: ImportarPreciosComponent},
            
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]
})
export class PagesRoutingModule {}
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

var misc: any = {
  sidebar_mini_active: true
};
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}
export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
  
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "configuraciones",
    title: "Configuraciones",
    type: "sub",
    icontype: "ni-map-big text-primary",
    isCollapsed: true,
    children: [
      { path: "empresa", title: "Configuración de la empresa", type: "link" },
      { path: "dominios", title: "Configuración de dominios", type: "link" },
      { path: "general", title: "Configuración general ", type: "link" },
    ]
  },
  {
    path: "admin",
    title: "Dashboard",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "dashboard", title: "Dashboard", type: "link" },
    ]
  },
  
  {
    path: "pedidos",
    title: "Pedidos",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "clientes", title: "Pedido de Clientes", type: "link" },
      { path: "vendedores", title: "Pedido de Vendedores", type: "link" },    
    ]
  },
  
  {
    path: "vendedor",
    title: "Vendedor",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "vendedores", title: "Lista Vendedores", type: "link" },
      { path: "importarVendedor", title: "Importar Vendedor", type: "link" },    
    ]
  },
  
  //
  {
    path: "cliente",
    title: "Clientes",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "clientes", title: "Lista clientes", type: "link" },
      { path: "importar", title: "Importar", type: "link" },    
      { path: "agregar-comprobante", title: "Agregar comprobantes", type: "link" },    
      { path: "lista-comprobante", title: "Listar comprobantes", type: "link" },    
    ]
  },
  {
    path: "producto",
    title: "Productos",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "configuracion", title: "Configuración de productos", type: "link" },
      { path: "productos", title: "Lista Productos", type: "link" },
      { path: "importarproducto", title: "Importar Productos", type: "link" },
      { path: "importarfotos", title: "Importar Fotos", type: "link" },
    ]
  },
  {
    path: "precios",
    title: "Precios",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "lista", title: "Lista Precios", type: "link" },
      { path: "importar-precios", title: "Importar precios", type: "link" },
    ]
  },
  {
    path: "banners",
    title: "Banners",
    type: "link",
    icontype: "ni-map-big text-primary",
  },
];

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar_admin.component.html',
  styleUrls: ['./sidebar_admin.component.scss']
})
export class SidebarAdminComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }
  onLogout(){
    localStorage.removeItem('usuario');
    this.router.navigateByUrl('/login');
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}

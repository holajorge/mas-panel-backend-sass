import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

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
 /* {
    path: "tareas",
    title: "Tareas",
    type: "link",
    icontype: "fas fa-sitemap text-primary",
  }, */
  {
    path: "cuenta",
    title: "Mi cuenta",
    type: "sub",
    icontype: "ni-map-big text-primary",
    isCollapsed: true,
    children: [
      { path: "datos", title: "Datos", type: "link" },
      { path: "pagos", title: "Pagos", type: "link" },
    ]
  },
  {
    path: "configuraciones",
    title: "Configuraciones",
    type: "sub",
    icontype: "fa fa-sliders-h text-primary",
    isCollapsed: true,
    children: [
      { path: "empresa", title: "Configuración de la empresa", type: "link" },
     /* { path: "dominios", title: "Configuración de dominios", type: "link" },*/
      { path: "general", title: "Configuración general ", type: "link" }
    ]
  },
 /* {
    path: "admin",
    title: "Dashboard",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "dashboard", title: "Dashboard", type: "link" },
    ]
  }, */
  
  {
    path: "pedidos",
    title: "Pedidos",
    type: "sub",
    icontype: "fa fa-shopping-cart text-primary",
    isCollapsed: true,
    children: [
      { path: "clientes", title: "Pedidos de clientes", type: "link" },
     /* { path: "vendedores", title: "Pedido de Vendedores", type: "link" }, */   
    ]
  },
  
  {
    path: "vendedor",
    title: "Vendedor",
    type: "sub",
    icontype: "fa fa-user text-primary",
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
    icontype: "fa fa-user-friends text-primary",
    isCollapsed: true,
    children: [
      { path: "clientes", title: "Lista clientes", type: "link" },
      { path: "importar", title: "Importar", type: "link" },    
      { path: "agregar-comprobante", title: "Agregar comprobantes", type: "link" },    
      { path: "lista-comprobante", title: "Listar comprobantes", type: "link" },    
    ]
  },
  // {
  //   path: "categorias",
  //   title: "Categorias",
  //   type: "link",
  //   icontype: "ni-map-big text-primary",
  // },
  {
    path: "categorias",
    title: "Categorias",
    type: "sub",
    icontype: "fa fa-folder text-primary",
    isCollapsed: true,
    children: [
      { path: "lista", title: "Lista Categoria", type: "link" },
      { path: "importar", title: "importar Categoria", type: "link" },
    ]
  },
  {
    path: "producto",
    title: "Productos",
    type: "sub",
    icontype: "fa fa-cube text-primary",
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
    title: "Precios", //Descuentos por Categorias
    type: "sub",
    icontype: "fa fa-tags text-primary",
    isCollapsed: true,
    children: [
     /* { path: "lista", title: "Lista Precios", type: "link" },
      { path: "importar-precios", title: "Importar precios", type: "link" }, */
      { path: "descuento-lista", title: "Lista Descuentos", type: "link" },
      /* { path: "descuento-categorias", title: "Descuentos por Categorias", type: "link" }, */
       { path: "lista-precios", title: "Listas de Precios", type: "link" },
    ]
  },
  {
    path: "banners",
    title: "Banners",
    type: "link",
    icontype: "fa fa-images text-primary",
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
  public optionModal: BsModalRef;
  constructor(private router: Router, public onboardingService:WalkthroughService, private modalService: BsModalService) { }

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

  setStepOnboarding(task_name){
    if(this.onboardingService.on == false){
        return;
    }
    if(task_name == 'taskClickProducts'){
        this.openModalOptionsOnboarding();
    }
    this.onboardingService.submit(task_name);
  }

  checkTask(menuitem, task_name){
    var aux_keys = {"producto": 1, "importarproducto": 1, "productos": 1, "cliente": 1, "clientes": 1};

    switch (task_name) {
        case 'taskClickProducts':
            if(menuitem.path == "producto"){
                return true;
            }
            break;
        case 'clickImport':
            if(menuitem.path == "importarproducto"){
                return true;
            }
            break;
        case 'clickProductList':
            if(menuitem.path == "productos"){
                return true;
            }
            break;
        case 'clickClients':
            if(menuitem.path == "cliente"){
                return true;
            }
            break;
        case 'clickListClients':
            if(menuitem.path == "clientes"){
                return true;
            }
            break;
        case 'nothing':
            if(!(menuitem.path in aux_keys)){
                return true;
            }
        default:
            return false;
    }
    return false;
  }

  @ViewChild('modalLoadOptionOnboarding') modalLoadOptionOnboarding: ElementRef;
  openModalOptionsOnboarding(){
    this.optionModal = this.modalService.show(
      this.modalLoadOptionOnboarding,
      {keyboard: true, class: "modal-dialog-centered modal-lg static"}
    );
  }

  public collapseAll(){
    for(let menuitem of this.menuItems){
        menuitem.isCollapsed = true;
        console.log(menuitem);
    }
  }

}

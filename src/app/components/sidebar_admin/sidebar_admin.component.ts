import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ConfigService } from 'src/app/service/config/config.service';

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
  param?: string;
  
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
  param?: string;
}
//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "tareas",
    title: "Inicio",
    type: "link",
    icontype: "fas fa-sitemap text-primary",
  }, 
  {
    path: "cuenta",
    title: "Mi cuenta",
    type: "sub",
    icontype: "ni-map-big text-primary",
    isCollapsed: true,
    children: [
      { path: "datos", title: "Datos", type: "link" }
    //  { path: "pagos", title: "Pagos", type: "link" },
    ]
  },
  {
    path: "usuarios",
    title: "Usuarios",
    type: "link",
    icontype: "fa fa-users-cog text-primary"
  },
  {
    path: "configuraciones",
    title: "Configuraciones",
    type: "sub",
    icontype: "fa fa-sliders-h text-primary",
    isCollapsed: true,
    children: [
      { path: "empresa", title: "Datos de la empresa", type: "link" },
     /* { path: "dominios", title: "Configuración de dominios", type: "link" },*/
      { path: "general", title: "Configuración general ", type: "link" }
    ]
  },
 {
    path: "admin/dashboard",
    title: "Reportes",
    type: "link",
    icontype: "ni ni-chart-bar-32 text-primary"
  },
  
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
    path: "deposito",
    title: "Depósito",
    type: "sub",
    icontype: "fa fa-folder-open text-primary",
    isCollapsed: true,
    children: [
      { path: "armar", title: "Armar pedidos", type: "link" },
      { path: "faltantes", title: "Productos Faltantes", type: "link" },
      { path: "armados", title: "Pedidos Armados", type: "link" },
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
      { path: "importar", title: "Importar clientes", type: "link" },    
      { path: "importar-sucursales", title: "Importar sucursales de clientes", type: "link" },    
      // { path: "agregar-comprobante", title: "Agregar comprobantes", type: "link" },    
      { path: "lista-comprobante", title: "Listar comprobantes", type: "link" },    
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
      { path: "productos", title: "Lista de productos", type: "link" },
      { path: "importarproducto", title: "Importar Productos", type: "link" },
      { path: "importarfotos", title: "Importar Fotos", type: "link" },
      { path: "permisos", title: "Permisos de clientes", type: "link" },
      { path: "importar-permisos", title: "Importar permisos de clientes", type: "link" },
      { path: "galeriafotos", title: "Galería de Fotos", type: "link" },
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
      { path: "lista-precios", title: "Lista Precios", type: "link" },
      { path: "importar-lista-precios", title: " Importar Listas de Precios", type: "link" },
      { path: "stock-precio", title: "Actualizar Precios y Stock por Excel", type: "link" },
      { path: "actualizar-precios", title: "Actualizar Precios", type: "link" },
      { path: "actualizar-dolar", title: "Actualizar Dolar", type: "link" }

    ]
  },
  {
    path: "precios",
    title: "Descuentos",
    type: "sub",
    icontype: "fa fa-tags text-primary",
    isCollapsed: true,
    children: [
      { path: "descuento-lista", title: "Descuentos", type: "link", param: 'simple'},
      { path: "descuento-lista", title: "Descuento por volumen", type: "link", param: 'volumen'},
      { path: "importar-descuentos", title: "Importar descuentos", type: "link" },
    ]
  },
  {
    path: "tapice",
    title: "Tapicé",
    type: "link",
    icontype: "fa fa-images text-primary",
  },
  {
    path: "banners",
    title: "Banners",
    type: "link",
    icontype: "fa fa-images text-primary",
  },
  {
    path: "tutoriales",
    title: "Tutoriales",
    type: "link",
    icontype: "fa fa-link text-primary",
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
  empresa: any = {id:''};
  flag:boolean;
  permisos: any[];
  constructor(private router: Router, public onboardingService:WalkthroughService, private modalService: BsModalService, public configService: ConfigService,) { }

  async ngOnInit(): Promise<void>  {
    await this.getTapiceEmpresa();
    // console.log(this.flag);
    // await this.itemsMenu();
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    // Hardcodeo de usuario
    if(localStorage.getItem('permisos') == null){
      localStorage.setItem('permisos', "todos");
    }
    this.permisos = localStorage.getItem('permisos').split(",");
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }
  getTapiceEmpresa = async() =>  {
    this.empresa.token = localStorage.getItem('usuario');
    await this.configService.getEmpresaTapice(this.empresa).subscribe( 
      (flag:boolean) =>{
        this.itemsMenu(flag);
      },
      (error) => {
        console.log(error);
        this.itemsMenu(false);
      }
    )
  }
  itemsMenu = (flag) => {
    
    if(!flag){
      let menu = [];
      ROUTES.map( (item) => {      
        if(item.path != 'tapice'){
          menu.push(item);
        }
      });
      this.menuItems = menu;
    }else{
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

  }
  onLogout(){
    localStorage.removeItem('usuario');
    localStorage.removeItem('permisos');
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
        //console.log(menuitem);
    }
  }

}

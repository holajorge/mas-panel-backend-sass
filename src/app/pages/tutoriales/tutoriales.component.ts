import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-tutoriales',
  templateUrl: './tutoriales.component.html',
  styleUrls: ['./tutoriales.component.scss']
})
export class TutorialesComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  lista:any = [];
  ruta:string = '';
  titulo:string = '';
  constructor(private modalService: BsModalService) { }
  
  ngOnInit() {
    this.lista = [
      {'titulo': '1. Introducción al Panel Administrador.', 'link': 'https://www.youtube.com/embed/xmldV692sw8?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '2. Alta Manual de Clientes.', 'link': 'https://www.youtube.com/embed/efDd4IsgSho?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '3. Configuración de productos.', 'link': 'https://www.youtube.com/embed/rpglmOXwngw?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '4. Alta Manual de Productos.', 'link': 'https://www.youtube.com/embed/kkKZCAEWx4M?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '5. Listado de Pedidos.', 'link': 'https://www.youtube.com/embed/lJznQeP4fwI?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '6. Alta Masiva de Productos.', 'link': 'https://www.youtube.com/embed/6blJnFnhz0A?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '7. Alta Masiva de Clientes.', 'link': 'https://www.youtube.com/embed/JM_optrNN00?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '8. Listado de Productos.', 'link': 'https://www.youtube.com/embed/6k_0uZzYcBI?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '9. Importar Sucursales.', 'link': 'https://www.youtube.com/embed/DQHnHLzKcI0?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '10. Administrar Comprobantes.', 'link': 'https://www.youtube.com/embed/HzQTM4vpUiU?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '11. Administrar Vendedores.', 'link': 'https://www.youtube.com/embed/R8uQ6Xz4og4?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '12. Configurar Datos de mi Cuenta.', 'link': 'https://www.youtube.com/embed/7-dvVLpLCGI?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '13. Configuración General.', 'link': 'https://www.youtube.com/embed/vB93z82KR3M?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '14. Configuración de Datos de la Empresa.', 'link': 'https://www.youtube.com/embed/gPCPjWIT0J8?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '15. Administrar Sucursales de Clientes.', 'link': 'https://www.youtube.com/embed/WRL6JTHGc_Y?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
      {'titulo': '16. Administrar Clientes.', 'link': 'https://www.youtube.com/embed/mBKSOBlvHnY?list=PL8h-Lqa5zFGDVWNmqhkRNPkpvvrXefNLw'},
    ];
  }
  modalOpen(modalVideo,item){
    
    this.titulo = item.titulo
    this.ruta = item.link
    this.notificationModal = this.modalService.show(modalVideo,this.notification);
  }
}
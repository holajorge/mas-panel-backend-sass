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
      {'titulo': '1. Cómo ingresar al catálogo.', 'link': 'https://www.youtube.com/embed/qEGrku-S8mc'},
      {'titulo': '2. Cómo realizar búsquedas.', 'link': 'https://www.youtube.com/embed/-T7GNo8-G8g'},
      {'titulo': '3. Cómo buscar por código de barras.', 'link': ''},
      {'titulo': '4. Cómo agregar un producto al pedido.', 'link': ''},
      {'titulo': '5. Cómo pedir un combo.', 'link': ''},
      {'titulo': '6. Cómo enviar el pedido.', 'link': ''},
      {'titulo': '7. Cómo consultar pedidos anteriores.', 'link': ''},
      {'titulo': '8. Cómo definir el markup.', 'link': ''},
      {'titulo': '9. Cómo imprimir un listado.', 'link': ''},
      {'titulo': '10. Cómo visualizar la pantalla de ventas.', 'link': ''},
      {'titulo': '11. Cómo ocultar los costos.', 'link': ''}
    ];
  }
  modalOpen(modalVideo,item){
    
    this.titulo = item.titulo
    this.ruta = item.link
    this.notificationModal = this.modalService.show(modalVideo,this.notification);
  }
}
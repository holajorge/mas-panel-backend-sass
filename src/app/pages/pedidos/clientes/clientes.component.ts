import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/config/config.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static",
  };
  activeRow: any;
  activeRowDet: any;
  empresa:any = {id:'', pedido:''};
  temRow:any = [];
  temRowDet:any = [];
  temp = [];
  detalleRow = [];
  tempRow = [];
  tempRowDet:any = [];
  loadingIndicator = true;
  entries: number = 10;
  entriesDet: number = 10;
  addForm: FormGroup;
  btnvisibility: boolean = true;  
  emptyTable:boolean = false;
  dataExcel: any = [];
  

  constructor(private pedidosService: PedidosService,
    public translate: TranslateService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ){ 
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');
    this.getPedidos();
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      pedido_id: ['', Validators.required],
      comentario: ['', Validators.required],
    });
  }
  getPedidos(){ 

    this.pedidosService.getPedidosCliente(this.empresa).then( (res:any) =>{    
    
      if(res.pedidos.pedidos.length > 0){

        this.emptyTable = true;
        this.temp = res.pedidos.pedidos;
        this.tempRow = res.pedidos.pedidos;
        this.loadingIndicator = true;
        this.dataExcel = res.pedidos.detalle;

      }else{
        this.emptyTable = false;

      }

    }).catch(err=>{
      console.log(err);
    });


  }
  dataExcelClientes(row){
    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadPedido?pedido="+row.id, "_blank");
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  entriesChangeDet($event){
    this.entriesDet = $event.target.value;
  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      this.temRow = this.temp.filter(function (d) {
      
        for (var key in d) {
          if(!Array.isArray(d[key])){      
            let hola = (d[key] != null) ? d[key].toLowerCase() : '';
            if ( hola.indexOf(val) !== -1) {
              return true;
            }      

          }  
        }
        return false;
      });
      this.temp =this.temRow;
    }else{
      this.temp = this.tempRow;
    }    
  }
  filterTableDet(event){
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      this.temRowDet = this.detalleRow.filter(function (item) {
        console.log(item);
        console.log(val);        
        
        for (var key in item) {
          let hola = (item[key] != null) ? item[key].toLowerCase() : '';
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }
        return false;
      });
      this.detalleRow =this.temRowDet;
    }else{
      this.detalleRow = this.tempRowDet;
    }
  }
  onSelectItem(modalEditVendedor,row) {
    this.detalleRow = [];
    this.empresa.pedido = row.id;
    this.pedidosService.getDetalles(this.empresa).then( (res:any) =>{    
      this.detalleRow = res.detalles;
      this.tempRowDet = res.detalles;
      this.loadingIndicator = true;

    }).catch(err=>{
      console.log(err);
    });

    // this.detalleRow = row.pedido_id;
    // this.tempRowDet = row;
    console.log(row);
    this.notificationModal = this.modalService.show(
      modalEditVendedor,
      this.notification
    );
    
    // this.addForm.setValue({id:row.id, nombre:row.nombre, email:row.email, clave:row.clave, lista: hola['lista'], archivo:hola['baja']});
    // this.btnvisibility = false;  

  }
  onaddComente(modalComent,row){
    
    this.addForm.setValue({pedido_id: row.id,comentario:row.comentario});
    this.btnvisibility = false;
    this.notificationModal = this.modalService.show(
      modalComent,
      this.notification
    );
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  onActivateDet(event) {
    this.activeRowDet = event.row;
  }
  guardarComentarioPedido(){

    this.pedidosService.getGuardarComentario(this.addForm.value).then( (res:any) =>{    
      console.log(res);
      if(res.resultado == true){
        Swal.fire('Listo!','Comentario agregado, con exito!', 'success')
        this.notificationModal.hide();
        this.getPedidos();
       }else{
        Swal.fire('Error!','el comento no fue guardado, tente novamente', 'error')
       }
    }).catch(err=>{
      console.log(err);
    });
  }
}

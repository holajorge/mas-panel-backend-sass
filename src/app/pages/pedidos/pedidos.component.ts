import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg static", 
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
  constructor(private pedidosService: PedidosService,public translate: TranslateService,private modalService: BsModalService,private formBuilder: FormBuilder,) {

    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
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

    this.pedidosService.getPedidos(this.empresa).then( (res:any) =>{    
      this.temp = res.pedidos;
      this.tempRow = res.pedidos;
      this.loadingIndicator = true;

    }).catch(err=>{
      console.log(err);
    });


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

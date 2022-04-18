import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/config/config.service';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
  detalleSucursal;
  detalleId;
  tempRow = [];
  tempRowDet:any = [];
  loadingIndicator = true;
  entries: number = 10;
  entriesDet: number = 10;
  addForm: FormGroup;
  btnvisibility: boolean = true;  
  emptyTable:boolean = false;
  dataExcel: any = [];
  nroPedido:string = "";
  nroCliente:string = "";
  dateStar:any;
  dateEnd:any;
  lista_estados: any = [];
  lista_estadosFiltros: any = [];
  estado_to_id: any = {};
  models: any = {};
  estadoSelect:number;
  noteForm:FormGroup;

  constructor(private pedidosService: PedidosService,
    public translate: TranslateService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ){ 
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');
   
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      pedido_id: ['', Validators.required],
      comentario: ['', Validators.required],
    });

    this.noteForm = this.formBuilder.group({
      pedido_id: ['', Validators.required],
      notas: ['', Validators.required],
    });
    
    this.lista_estados = [];
    this.lista_estadosFiltros = [];
    this.pedidosService.getDistinctEstadoPedidos(this.empresa).then( (res:any) =>{
      this.lista_estadosFiltros = res.resultado;
      res.resultado.forEach(element => {
        this.lista_estados.push(element.estado);
        this.estado_to_id[element.estado] = element.estado_id;
      });

      this.getPedidos();

    }).catch(err=>{
      console.log(err);
    });

  }
  getPedidos(){ 

    this.pedidosService.getPedidosCliente(this.empresa).then( (res:any) =>{    

      res.pedidos.pedidos.forEach(element => this.models[element.id] = element.estado);

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
  filters(){
       
    const npedido = this.nroPedido;
    const ncliente = this.nroCliente;
    const star = this.dateStar;
    const end = this.dateEnd;
    const estado = this.estadoSelect;
    
    const filtros = {
      estado: [estado, d => d['estado'].includes(estado)],

      id: [npedido, d => {
        let nroI = d['numeroInterno'].toLowerCase();
        if(nroI.includes(npedido.toLocaleLowerCase()) ){
          return true;
        } 
      }],
      nrocliente: [ncliente, d => {
        let nroC = d['nrocliente'].toLowerCase();
        if(nroC.includes(ncliente.toLocaleLowerCase()) ){
          return true;
        }
      }],
      star: [star, d => {
        if(d['fechafiltro'] >= star){
          return true;
        }
        // d['fechafiltro'].includes(star)
      }],
      end: [end, d => {

        if(star <= d['fechafiltro'] && d['fechafiltro'] <= end ){
          return true
        }
      }],
    }
    let producto1 = this.tempRow;  
    for (const filtro in filtros) {
      if(filtros[filtro][0]){
        producto1 = producto1.filter( filtros[filtro][1])   
      }
    }         
    this.temp = producto1;  

  }
  eliminar(){
    this.nroPedido = null;
    this.nroCliente = null;
    this.dateStar = null;
    this.dateEnd = null;
    this.temp = this.tempRow;
  }
  dataExcelClientes(row){
    
    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadPedido?pedido="+row.id+"&token="+this.empresa.id, "_blank");
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
        // return false;
      });
      this.temp =this.temRow;
    }else{
      this.temp = this.tempRow;
    }    
  }
  filterTableDet(event){
    const val = event.target.value.toLowerCase();
    
    
    if(val.length > 0){    
      
      this.detalleRow = this.tempRowDet;
      let temRowDet = this.detalleRow.filter(function (item) {          
        for (var key in item) {     
                    
          let hola = (item[key] != '' && item[key] != null) ? item[key].toLowerCase() : '';          
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }   
      });
     
      this.detalleRow = temRowDet;
      
    }else{
      this.detalleRow = this.tempRowDet;
    }
  }
  onSelectItem(modalEditVendedor,row) {
    this.detalleRow = [];
    this.empresa.pedido = row.id;
    Swal.showLoading();

    this.detalleId = row.numeroInterno;
    this.pedidosService.getDetalles(this.empresa).then( (res:any) =>{    

      this.detalleSucursal = res.detalles.sucursal;
      this.detalleRow = res.detalles.detalle;
      this.tempRowDet = res.detalles.detalle;
      this.loadingIndicator = true;

      this.detalleRow.forEach((row) => {
        if("variaciones" in row && row["variaciones"]){
            row["cantidad"] = "";
            row["variaciones"].forEach((variacion) => {
                row["cantidad"] += variacion.cantidad.toString() + " x ";
                variacion.attributes.forEach((attr) => {
                    row["cantidad"] += "<strong>" + attr[0] + ": </strong>" + attr[1] + " / ";
                })
                row["cantidad"] = row["cantidad"].substring(0, row["cantidad"].length - 3) + "<br>";

            })
        }
      })

      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
    
    this.notificationModal = this.modalService.show(
      modalEditVendedor,
      this.notification
    );

  }
  onaddComente(modalComent,row){
    
    this.addForm.setValue({pedido_id: row.id,comentario:row.comentario});
    this.btnvisibility = false;
    this.notificationModal = this.modalService.show(
      modalComent,
      this.notification
    );
  }
  addNote(modalNote,row){
    console.log(row);
    if(row.notas){
      this.noteForm.patchValue({notas:row.notas});
    }
    this.noteForm.patchValue({pedido_id: row.id});
    
    // this.btnvisibility = false;
    this.notificationModal = this.modalService.show(
      modalNote,
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
        Swal.fire('Listo!','Comentario agregado con éxito!', 'success')
        this.notificationModal.hide();
        this.getPedidos();
       }else{
        Swal.fire('Error!','El comentario no fué guardado intente nuevamente', 'error')
       }
    }).catch(err=>{
      console.log(err);
    });
  }
  guardarNotaPedido(){
    this.pedidosService.getGuardarNota(this.noteForm.value).then( (res:any) =>{    
      console.log(res);
      if(res.resultado == true){
        Swal.fire('Listo!','Nota agregada con éxito!', 'success')
        this.notificationModal.hide();
        this.noteForm.reset();
        this.getPedidos();
       }else{
        Swal.fire('Error!','La nota no fué guardada intente nuevamente', 'error')
       }
    }).catch(err=>{
      console.log(err);
    });
  }

  change_state(row){
    console.log(row);
    if(this.models[row.id] == null){
        this.models[row.id] = row["estado"];
        return;
    }
    let estado = row["estado"];
    row["estado"] = this.models[row.id];
    row["pedido_estado_id"] = this.estado_to_id[row["estado"]];
    this.pedidosService.updateEstadoPedido(row).then( (res:any) =>{
      if(res.resultado == true){
        Swal.fire('Listo!','Estado cambiado con éxito!', 'success');
        this.notificationModal.hide();
        this.getPedidos();
       }else{
        this.models[row.id] = estado;
        row["estado"] = estado;
        Swal.fire('Error!','El estado no fue modificado, intente nuevamente', 'error');
       }
    }).catch(err=>{
      console.log(err);
    });
  }

}

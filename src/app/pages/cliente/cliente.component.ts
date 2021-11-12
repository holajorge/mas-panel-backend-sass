import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {ClienteService } from '../../service/cliente/cliente.service';
import {TranslateService} from '@ngx-translate/core';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { ConfigService } from 'src/app/service/config/config.service';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresa:any = {id:'', pedido:''};
  pedido:any = {empresa:'', pedido:'', nrocliente: '', vendedor:''};
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
  addFormNew: FormGroup;
  btnvisibility: boolean = true;
  btnvisibilityAdd:boolean = true;
  activeRow: any;
  activeRowDet: any;
  cliente_id:any = {id:''};
  cont: any = 0;
  //filter
  nroCliente:any = '';
  nombreCliente:any = '';
  mailCliente:any = '';
  activoCliente:boolean = false;
  constructor(
    private clienteService: ClienteService,
    public translate: TranslateService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder, public onboardingService:WalkthroughService
  ) {       
      this.translate.use('es');
      this.empresa.id = localStorage.getItem('usuario');
      this.getClientes();
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      nrocliente: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      descuento_general: ['', Validators.required],
      usuario: ['', Validators.required],
      cuit: ['', Validators.required],
      telefono: ['', Validators.required],
      encargado_compras: [''],
      encargado_pagos: [''],
      provincia: [''],
      localidad: [''],
      direccion: [''],
      coeficiente: [''],
      clave: ['']
    });
    this.addFormNew = this.formBuilder.group({
      empresa_id: this.empresa,
      nrocliente: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],

      descuento_general: ['', Validators.required],
      cuit: ['', Validators.required],
      telefono: ['', Validators.required],
      encargado_compras: [''],
      encargado_pagos: [''],
      provincia: [''],
      localidad: [''],
      direccion: [''],
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  entriesChangeDet($event){
    this.entriesDet = $event.target.value;
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
  getClientes(){ 
    this.clienteService.getcliente(this.empresa).then( (res:any) =>{    
      
      this.temp = res.pedidos['clientes'];
      this.tempRow = res.pedidos['clientes'];
      this.loadingIndicator = true;
    }).catch(err=>{
      console.log(err);
    });
  }
  pedidos(modalPedido,row){
    console.log(row);
    Swal.showLoading();
    this.detalleRow = [];
    this.pedido.empresa = row.empresa_id;
    this.pedido.vendedor = row.vendedor_id;
    this.pedido.nrocliente = row.nrocliente;
    this.clienteService.getPedidoCliente(this.pedido).then( (res:any) =>{    
      console.log(res.pedidos);
      Swal.close();
      this.detalleRow = res.pedidos.pedidos;
      this.tempRowDet = res.pedidos.pedidos;

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
    
    this.notificationModal = this.modalService.show(
      modalPedido,
      this.notification
    );
  }
  dataExcelClientes(row){

    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadPedido?pedido="+row.id, "_blank");

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
  onSelectItem(modalEdit,row) {
    this.empresa.cliente = row.nrocliente;
    this.notificationModal = this.modalService.show(
      modalEdit,
      this.notification
    );
    console.log(row);
    this.addForm.setValue({
      nrocliente:row.nrocliente, 
      nombre:row.nombre, 
      clave: row.clave,
      email:row.email, 
      descuento_general:row.descuento_general, 
      usuario:row.usuario, 
      cuit:row.cuit, 
      telefono:row.telefono, 
      encargado_compras:row.encargado_compras, 
      encargado_pagos:row.encargado_pagos, 
      provincia:row.provincia, 
      localidad:row.localidad, 
      direccion:row.direccion, 
      coeficiente: row.coeficiente
      
    });
    this.btnvisibility = false;  

  }
  
  addCliente(modalAdd){

    this.btnvisibilityAdd = false;
    this.notificationModal = this.modalService.show(
      modalAdd,
      this.notification
    );
  
  }
  updateCliente(){
    
    this.clienteService.postCliente(this.addForm.value).then( (res:any) =>{    
      if(res.response == true){
        this.notificationModal.hide();
        this.loadingIndicator = true;
        this.addForm.reset();
        this.getClientes();
        Swal.fire('Listo!','Cliente Editado con éxito!', 'success')
      }else{
        Swal.fire('error, intente nuevamente', 'error')

      }

    }).catch(err=>{
      console.log(err);
    });

  }
  insertNewClient(){

    this.clienteService.postInsertCliente(this.addFormNew.value).then( (res:any) =>{    
      if(res.response == true){
        this.notificationModal.hide();
        this.loadingIndicator = true;
        this.addFormNew.reset();
        this.getClientes();
       
        Swal.fire('Listo!','Cliente creado con exito!', 'success')
      }else{

        Swal.fire('Upps!','Error al crear el nuevo cliente,intente de nuevo!', 'error')
      }

    }).catch(err=>{
      console.log(err);
    });

  }
  onDisableActive(row){    
    Swal.fire({
      title: 'Seguro de deshabilitar?',
      text: "Deshabilitar al cliente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Deshabilitar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          this.deshabilitar(row);
        }
    })
  }
  onActiveClient(row){    
    console.log(row);
    Swal.fire({
      title: 'Seguro de Habilitar?',
      text: "Habilitar cliente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Habilitar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          this.habilitar(row);
        }
    })
  }
  deshabilitar(cliente){
    console.log(cliente);
    this.cliente_id.id = cliente.nrocliente;

    this.clienteService.postDeshabilitar(this.cliente_id).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Cliente deshabilitado con exito!', 'success')
        this.getClientes();
      }else{
        Swal.fire('Upps!','Error al deshabilitar al cliente, intente nuevamente!', 'error')
      }

    }).catch(err=>{
      console.log(err);
    });
  }
  habilitar(cliente){

    this.cliente_id.id = cliente.nrocliente;
    this.clienteService.postHabilitar(this.cliente_id).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Cliente habilitado con exito!', 'success')
        this.getClientes();
      }else{
        Swal.fire('Upps!','Error al habilitar al cliente, intente nuevamente!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  onActivateDet(event) {
    this.activeRowDet = event.row;
  }

  filters(){

    const nCliente = this.nroCliente;
    const nomCliente = this.nombreCliente;    
    const correo = this.mailCliente;
    let activo = null;
    if(this.cont == 1){
      activo = true
    }else{
      activo = (this.activoCliente == true) ? true : false;
    }
    
    activo = (activo == true) ? true : false;

    // let activo = this.activoCliente;
    console.log(activo);

    const filtros = {
      codigo: [nCliente, d => d['nrocliente'].includes(nCliente)],
      nombre: [nomCliente, d => {
        let nombre = d['nombre'].toLowerCase();
        
        if(nombre.includes(nomCliente)){
          return true;
        }
      }],
      correo: [correo, d => {
        let email = d['email'].toLowerCase();        
        if(email.includes(correo)){
          return true;
        }
      }],
      activo: [activo, d => {

        if(d['activo'] == "1"){
          return true;
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
  cambia(){
    this.cont++;
    console.log('input chek esta en:', this.activoCliente);

    console.log('contador vale:', this.cont);
    this.activoCliente = (this.activoCliente == true) ? false : true;

    console.log('check esta en:', this.activoCliente);
    this.filters();
  }

  eliminar(){
    this.cont = 0;
    this.nroCliente = '';
    this.nombreCliente = '';    
    this.mailCliente = '';
    this.activoCliente = false;
    this.temp = this.tempRow;
  }
  
}

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
import { PreciosService } from 'src/app/service/precios/precios.service';
import { VendedorService } from 'src/app/service/vendedor/vendedor.service';

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
  editForm: FormGroup;
  editFormSucursal: FormGroup;

  btnvisibility: boolean = true;
  btnvisibilityIn:boolean = true;
  activeRow: any;
  activeRowDet: any;
  cliente_id:any = {id:''};
  price_lists:any = [];
  vendedores:any = [];
  lista_vendedores:any = [];

  cont: any = 0;
  //filter
  nroCliente:any = '';
  nombreCliente:any = '';
  mailCliente:any = '';
  activoCliente:boolean = false;

  dominio:any = '';

  //sucursales
  dataSucursal:any = [];
  tempDataSucursal:any = [];
  columnSucursal = [ 
    {prop:'nombre_sucursal',name:'Nombre sucursal'}, 
    {prop:'direccion_sucursal', name: 'Direccion'}, 
    {prop:'telefono_sucursal',name: 'Telefono'} 
  ]
  cliente:string = '';
  flagSendEmail:boolean = false;
  flagNew:boolean = false;

  //pago
  formadePago:any = [];
  flagPago: boolean = false;
  ver_agregar_pago: boolean = false;
  addTextPago: boolean = false;
  arrayPagos:any = [];

  flagEdit:boolean = false;
  dataCliente:{} = {};

  dataFilter:any= [];
  page = 1;
  isDisabled = true;
  pageSize = 10;
  collectionSize:number = this.tempRow.length;
  constructor(
    private clienteService: ClienteService,
    public translate: TranslateService,
    private modalService: BsModalService,
    public preciosService:PreciosService,
    private formBuilder: FormBuilder, public onboardingService:WalkthroughService,
    private configService: ConfigService,
    private vendedorService: VendedorService,
  ) {
      this.translate.use('es');
      this.empresa.id = localStorage.getItem('usuario');
      this.getClientes();
  }

  ngOnInit() {

    this.editForm = this.formBuilder.group({
      empresa_id:  this.empresa.id,
      nrocliente: ['', Validators.required],
      nombre: ['', Validators.required],
      email: [''],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      descuento_general: [''],
      cuit: [''],
      telefono: [''],
      encargado_compras: [''],
      encargado_pagos: [''],
      provincia: [''],
      localidad: [''],
      direccion: [''],
      lista: [''],
      nroclientLast:[''] ,
      send:[''],
      pago: [''],
      info_general: [''],
      activo:[''],
      vendedor_id:[''],
    });
    this.editFormSucursal = this.formBuilder.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [''],
      cliente: ['', Validators.required],
      empresa_id: [''],
      id:['']
    });

    this.getDistinctListPrice();
    this.getVendedores();
    this.getConfig();

  }
  validarNroCliente(tipo){
    console.log(tipo);    
    let data = {
      nroInput: this.editForm.get('nrocliente').value,
      usuario: this.editForm.get('usuario').value,
      id: this.empresa.id,
      tipo: tipo
    }
    Swal.showLoading();
    this.clienteService.validNroClient(data).subscribe(
      (res) => {
        if(res){

          if(tipo == 'nro'){
            Swal.fire('Atencion','Nro de cliente ya existente, Ingrese uno diferente', 'warning');
            this.editForm.patchValue({nrocliente:''});
          }
          if(tipo == 'usuario'){
            Swal.fire('Atencion','nombre de usuario de cliente ya existente, Ingrese uno diferente', 'warning');

            this.editForm.patchValue({usuario:''});
          }
          
        }else{
          Swal.close();
        }
      },
      (error) => {
        Swal.fire('error','Error de comunicacion, intende de nuevo', 'error');
        if(tipo == 'nro'){
          this.editForm.patchValue({nrocliente:''});
        }
        if(tipo == 'usuario'){
          this.editForm.patchValue({usuario:''});
        }
        console.log(error);
        
      }
    )
  }
  invitarCliente(row){
    console.log(row);    
    Swal.fire({
      title: `Seguro de enviar invitación al cliente ${row.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Si, enviar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {

          setTimeout( ()=>{
              this.sendEmail(row);
          } ,1000);
          
        }
    })
  }
  sendEmail(row){
    Swal.showLoading();

    this.clienteService.sendEmailInvitacion({empresa:row.empresa_id, nroCliente:row.nrocliente}).subscribe(
      (res) => {
        console.log(res);
        if(res){
          Swal.fire('Listo!','Invitación enviada con éxito!', 'success')
        }else{
          Swal.fire('Error!','no fue posible enviar la invitacion con exito, intente de nuevo!', 'error')

        }
      },
      (error)=> {
        console.log(error);
        Swal.fire('Upps!','Error de comunicion, intente nuevamente!', 'error')

      }
    );
      
  }
  invitarTodos(){
    Swal.fire({
      title: `Seguro de enviar una invitación a todos los clientes?`,
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Si, enviar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {

          setTimeout( ()=>{
            this.sendEmailTodos()
          } ,1000);
          
        }
    })
  
  }
  sendEmailTodos(){
    Swal.showLoading();

    this.clienteService.sendEmailInvitacionTodos({empresa:this.empresa.id }).subscribe(
      (res) => {
        console.log(res);
        if(res){
          Swal.fire('Listo!','Invitaciones enviadas con éxito!', 'success')
        }else{
          Swal.fire('Error!','no fue posible enviar las invitaciones con exito, intente de nuevo!', 'error')

        }
      },
      (error)=> {
        console.log(error);
        Swal.fire('Upps!','Error de comunicion, intente nuevamente!', 'error')

      }
    );
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
      this.arrayPagos = res.pedidos['pagos'];
      
      this.collectionSize = this.temp.length;
      this.refreshDatos();
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

    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadPedido?pedido="+row.id+"&token="+this.empresa.id, "_blank");

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
    this.flagNew = false;

    this.empresa.cliente = row.nrocliente;
    this.notificationModal = this.modalService.show(
      modalEdit,
      this.notification
    );
    // console.log(row);
    this.editForm.patchValue({
      empresa_id: row.empresa_id,
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
      info_general: row.info_general,
      vendedor_id:row.vendedor_id,
      activo:row.activo==1,
      lista: row.lista,
      nroclientLast: row.nrocliente,
      pago: row.forma_pago
    });
    // console.log(this.editForm.value);

    this.btnvisibility = false;
    this.btnvisibilityIn = true;
    this.editForm.get('nrocliente').disable();
    this.flagSendEmail = false;
    this.flagPago = false;
    this.ver_agregar_pago = false;
  }
  
  addCliente(modalEdit){
    this.flagNew = true;
    this.editForm.reset();

    this.notificationModal = this.modalService.show(
      modalEdit,
      this.notification
    );

    this.btnvisibility = true;
    this.btnvisibilityIn = false;

    this.editForm.get('nrocliente').enable();

    this.flagSendEmail = true;

    this.flagPago = false;
    this.ver_agregar_pago = false;

  } 
  updateCliente(){
    Swal.showLoading();
    this.clienteService.postCliente(this.editForm.value).then( (res:any) =>{
      if(res.response == true){
        this.editForm.reset();
        this.notificationModal.hide();
        this.loadingIndicator = true;
        this.getClientes();
        Swal.fire('Listo!','Cliente Editado con éxito!', 'success')
      }else{
        Swal.fire('error, intente nuevamente', 'error')

      }

    }).catch(err=>{
      console.log(err);
      Swal.fire('error, intente nuevamente', 'error')

    });

  }
  insertNewClient(){

    this.editForm.controls['empresa_id'].setValue(this.empresa);
    Swal.showLoading();
    this.clienteService.postInsertCliente(this.editForm.value).subscribe( 
      (res) =>{
        if(res.flag == true){
          this.editForm.reset();
          this.notificationModal.hide();
          this.loadingIndicator = true;
          this.getClientes();
          Swal.fire('Listo!',res.msg, 'success');
        }else if(res.flag == 2){
          Swal.fire('Upps!',res.msg, 'error')
        }else if(res.flag == 3){

          Swal.fire('Upps!',res.msg, 'error')
        }
        // Swal.close();
      },
      (error) => {
        console.log(error);
        
        Swal.fire('Error!','Surgio un error inesperado, intente de nuevo', 'error')

      }
    );
    
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
    
    this.cliente_id.id = cliente.nrocliente;

    this.clienteService.postDeshabilitar({cliente:this.cliente_id, empresa:this.empresa }).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Cliente deshabilitado con éxito!', 'success')
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
    this.clienteService.postHabilitar({cliente:this.cliente_id, empresa:this.empresa }).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Cliente habilitado con éxito!', 'success')
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

  getDistinctListPrice(){
    this.preciosService.getDistinctListPrice(this.empresa).then( (res:any) =>{
      this.price_lists = res.listaPrecios;
      this.price_lists = this.price_lists.slice();
    }).catch(err=>{
      console.log(err);
    });
  }

  esMayuscula(letra){
      return letra === letra.toUpperCase();
  }
  comprobarTexto(itemBusqueda, textoInput ){

    if(this.esMayuscula(textoInput)){
      textoInput = textoInput.toUpperCase();
      itemBusqueda = itemBusqueda.toUpperCase();
      
    }else{
      textoInput = textoInput.toLowerCase()
      itemBusqueda = itemBusqueda.toLowerCase();
      
    }
    if(itemBusqueda.includes(textoInput)){
      return true;
    }else{
      return false;
    }

  }
  refreshDatos() {
    // this.rows = this.rowsTemp;
    // console.log(this.rows);
     if(this.dataFilter.length > 0){
      this.temp = this.dataFilter;
      this.temp = this.temp.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize, 
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    }else{

      this.temp = this.tempRow.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize, 
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    }
    
    console.log(this.temp);


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

    const filtros = {
      codigo: [nCliente, d => {
        if(this.comprobarTexto(d['nrocliente'],nCliente)){
          // d['nrocliente'].includes(nCliente)
          return true;

        }
      }],
      nombre: [nomCliente, d => {
        if(this.comprobarTexto(d['nombre'],nomCliente)){
          return true;
        }
      }],
      correo: [correo, d => {
        if(this.comprobarTexto(d['email'],correo)){
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

    if(producto1.length > 0){
      this.dataFilter = producto1;  
      this.collectionSize = producto1.length;
      this.refreshDatos();
    }else{
      this.dataFilter = [];  
      this.temp = [];
      this.collectionSize = 0;
    }   

    // this.temp = producto1;
  }
  cambia(){
    this.cont++;

    this.activoCliente = (this.activoCliente == true) ? false : true;

    this.filters();
  }

  eliminar(){
    this.cont = 0;
    this.nroCliente = '';
    this.nombreCliente = '';
    this.mailCliente = '';
    this.activoCliente = false;
    this.temp = this.tempRow;
    this.collectionSize = this.tempRow.length;
    this.dataFilter = [];
    this.refreshDatos();
  }

  openSucursal(modalSucursal, row){
    console.log(row);
    
    this.dataCliente = {cliente: row.nombre, nroCliente: row.nrocliente};

    this.editFormSucursal.reset();
    
    this.notificationModal = this.modalService.show(
      modalSucursal,
      this.notification
    );
    let data = {
      cliente: row.nrocliente, 
      empresa: this.empresa.id
    }
    this.cliente = row.nrocliente;
    this.editFormSucursal.controls['cliente'].setValue(row.nrocliente);
    this.getSucursales(data);

  } 
  getSucursales(data){
    Swal.showLoading();

    this.clienteService.getSucursalClient(data).subscribe(
      (res:any) =>{
        this.dataSucursal = res;
        this.tempDataSucursal = res;
        Swal.close();
      },
      (error) => {
        Swal.close();
        console.log(error);        
      }
    )

  }
  createSucursal(){
    Swal.showLoading();
    this.editFormSucursal.controls['empresa_id'].setValue(this.empresa.id);

    this.clienteService.postInsertClienteSucursal(this.editFormSucursal.value).subscribe( 
      (res) =>{
        
        if(res){
          let data = {
            cliente: this.editFormSucursal.get('cliente').value, 
            empresa: this.empresa.id
          }
          this.editFormSucursal.reset();
          this.editFormSucursal.controls['cliente'].setValue(this.cliente);

          this.getSucursales(data);
          // this.notificationModal.hide();
          Swal.fire('Listo!',res.msg, 'success');
        }else {
          Swal.fire('Upps!',res.msg, 'error')
        }
      },
      (error) => {
        console.log(error);
        
        Swal.fire('Error!','Surgio un error inesperado, intenete de nuevo', 'error')

      }
    );
  }
  eliminarSucursal(row){

    Swal.fire({
      title: 'Seguro de eliminar la sucursal?',
      text: "El dato se borrá permanentemente",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Si, eliminar',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
         let data = {
           id: row.id,
           empresa_id: this.empresa.id
         };
         this.clienteService.postEliminarClienteSucursal(data)
         .subscribe(
           (res) => {
              if(res){
                let data = {
                  cliente: this.editFormSucursal.get('cliente').value, 
                  empresa: this.empresa.id
                }
                this.getSucursales(data);

                Swal.fire('Listo!','Sucursal eliminada con éxito', 'success');
              }else{
                Swal.fire('Upps!','Hubo un error al eliminar sucursal', 'error')
              }
           },
           (error) => {
              console.log(error);
           }
         )
        }
    })


  }
  closeModal(modal){
    
  }
  addNewPago(){
    this.flagPago =! this.flagPago;
    this.ver_agregar_pago =! this.ver_agregar_pago;
  }
  editSucursales(row){
    this.flagEdit = true;
    
    this.editFormSucursal.patchValue({
      nombre: row.nombre_sucursal,
      direccion:row.direccion_sucursal,
      telefono:row.telefono_sucursal,
      cliente: row.nrocliente,
      empresa_id:row.empresa_id,
      id:row.id
    });
  }
  cancelarSucursal(){


    this.editFormSucursal.reset(); 
    this.editFormSucursal.patchValue({
      cliente:this.cliente
    })
    this.flagEdit = false;

  }
  saveEditSucursal(){
    Swal.showLoading();

    this.clienteService.postEditClienteSucursal(this.editFormSucursal.value).subscribe( 
      (res) =>{
        
        if(res){
          let data = {
            cliente: this.editFormSucursal.get('cliente').value, 
            empresa: this.empresa.id
          }
          this.editFormSucursal.reset();
          this.editFormSucursal.controls['cliente'].setValue(this.cliente);
          this.flagEdit = false;
          this.getSucursales(data);
          // this.notificationModal.hide();
          Swal.fire('Listo!',res.msg, 'success');
        }else {
          Swal.fire('Upps!',res.msg, 'error')
        }
      },
      (error) => {
        console.log(error);
        
        Swal.fire('Error!','Surgio un error inesperado, intenete de nuevo', 'error')

      }
    );
  }

  getConfig(){
    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
      if(res.response.body['configuraciones'] != ""){
        this.dominio = JSON.parse(res.response.body['configuraciones']).dominio;
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }

  getTokenLogin(cliente){
    this.clienteService.getTokenLogin(this.empresa.id,cliente["nrocliente"]).then( (res:any) =>{    
      Swal.close();
      if(res.flag){
        navigator.clipboard.writeText("https://"+this.dominio+"/#/login?token="+res.flag["usuario"])
        .then(() => {
          Swal.fire('Token copiado exitosamente!',"https://"+this.dominio+"/#/login?token="+res.flag["usuario"], 'success');
        })
        .catch((error) => {
          Swal.fire('Error, intente de nuevo!', 'error')
        });
      }else{
        Swal.fire('Error, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
  }

  getVendedores(){
    this.vendedorService.getVendedores(this.empresa).then( (res:any) =>{
      this.vendedores =res.vendedores ;
      res.vendedores.forEach(element => {
        this.lista_vendedores.push(element.nombre+" ("+element.vendedor+")");
      });
    }).catch(err=>{
      console.log(err);
    });
    
  }
}

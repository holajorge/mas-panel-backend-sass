import { Component, OnInit } from '@angular/core';
import {VendedorService } from '../../service/vendedor/vendedor.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';//importar para formular envio de todos los parametros
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { Router } from '@angular/router'; //para redireccionar las vistas
import * as XLSX from 'xlsx'; 
import {TranslateService} from '@ngx-translate/core';
import { ValidationService } from '../../service/validation/validation.service';
import { DescuentoCateService } from 'src/app/service/descuentoCate/descuento-cate.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss']
})
export class VendedorComponent implements OnInit {
  addForm: FormGroup;
  newFormVendedor: FormGroup;
  notificationModal: BsModalRef;
  selected: any[] = [];
  // VENDEDORES VAR
  temp = [];
  tempRow:any = [];
  loadingIndicator = true;
  entries: number = 10;
  temRow:any = [];
  activeRow: any;
  activeRowCliente: any;

  // RESTROS LOG VAR
  entrieslog: number = 10;
  entriesCliente: number = 10;
  tempRowLog:any = [];
  tempRowCliente:any = [];
  logRow:any =[];

  rows: any = [];
  
  reorderable = true;
  SelectionType = SelectionType;
  btnvisibility: boolean = true;  
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-sm static", 
  };
  empresa:any = {id:'',vendedor:''}; 
  clientes:any;
  mobileToDisplay:any=0;
  constructor(
    private router: Router,
    private vendedorService: VendedorService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder, 
    public translate: TranslateService,
    public descuentoCateService: DescuentoCateService

    ) {
    
    this.translate.use('es');
    
    if(localStorage.getItem('usuario') === null ){
      // redirect to login 
      this.router.navigate(['login']);
    }else{
      this.empresa.id = localStorage.getItem('usuario');
      this.getVendedor();
    }
    
  } 
  ngOnInit() {
    
    this.addForm = this.formBuilder.group({
      id: [],
      nombre: ['',Validators.required],
      email: ['', [Validators.required,ValidationService.emailValidator]],      
      nrovendedor: ['',Validators.required],
      telefono: ['',  Validators.required,],
    });

    this.newFormVendedor = this.formBuilder.group({
      nombre: ['',Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],      
      nrovendedor: ['',Validators.required],
      empresa_id: [''],
      telefono: ['', Validators.required],
    });
  }
  getVendedor(){

    this.vendedorService.getVendedores(this.empresa).then( (res:any) =>{
      this.temp = res.vendedores;
      this.tempRow = res.vendedores;
      this.loadingIndicator = false;
      // console.log(this.temp);
    }).catch(err=>{
      console.log(err);
    });
  }
  telInputObject(obj) {
    // obj.setCountry('ar');
    // obj.intlTelInput('setNumber');

  }  
  getNumber(event){
    console.log(event);

  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      let tempItems = this.temp.filter(function (d) {
        for (var key in d) {
          let hola = (d[key] != null) ? d[key].toLowerCase() : '';
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }
        return false;
      });
      this.temp = tempItems;
    }else{
      this.temp = this.tempRow;
    }

    
  }
  onSelectItem(modalEditVendedor,row) {
    this.notificationModal = this.modalService.show(
      modalEditVendedor,
      this.notification
    );
    let hola = {};
    if(row.configuracion != null && row.configuracion != ""){
      hola = JSON.parse(row.configuracion);
    }else{
      hola = {baja:0,lista:0};
    }
    this.addForm.patchValue({
      id:row.id, 
      nombre:row.nombre, 
      email:row.email, 
      telefono:row.telefono, 
      nrovendedor: row.vendedor
      // lista: hola['lista'], archivo:hola['baja']
    });
    this.btnvisibility = false;  

  }
  onUpdate(){

    let flag = String(this.addForm.get('telefono').value).toLowerCase().match(/[+]{1}[0-9]{2}[0-9]{1}[0-9]{2}[0-9]{8}$/);

    if(!flag){
      Swal.fire('Error', 'Error es necesario agregar correctamente el numero de telefo ejemplo: +5492223334444','error');
      return false;
    }
    Swal.showLoading();
    this.vendedorService.updateVendedor(this.addForm.value).subscribe(data => {  
      if(data == true){
        Swal.fire('','Datos del vendedor actualizado con éxito!', 'success')
        // this.addForm.reset();    
        this.addForm.patchValue({empresa_id: '',nombre:'', email:'', nrovendedor:'', telefono:''});        

        this.notificationModal.hide();
        this.getVendedor();
       }else{
        Swal.fire('Error, intnente de nuevo', 'error')
       }
    },  
    error => {  
      Swal.fire('Error, intnente de nuevo', 'error')
        console.log(error);
        
    });  
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  logLogin(modalLog,vendedor){

    this.notificationModal = this.modalService.show(modalLog,this.notification);
    Swal.showLoading();
    this.vendedorService.getLog(vendedor).then( (res:any) =>{

      if(res.success == true){
        Swal.close();
        this.logRow = res.logs;
        this.tempRowLog = res.logs;
      }else{
        Swal.close();
        //no hay registros 
      }
      
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  filterTableLog(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      let temRow = this.logRow.filter(function (d) {
        for (var key in d) {
          let hola = (d[key] != null) ? d[key].toLowerCase() : '';
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }
        return false;
      });
      this.logRow = temRow;
    }else{
      this.logRow = this.tempRowLog;
    }  
  }
  entriesChangeLog($event) {
    this.entrieslog = $event.target.value;
  }
  addVendedor(modalAdd){
    this.newFormVendedor.patchValue({empresa_id: this.empresa.id});
    this.notificationModal = this.modalService.show(modalAdd,this.notification);
  }
  onCreateVendedor(){
        

    let flag = String(this.newFormVendedor.get('telefono').value).toLowerCase().match(/[+]{1}[0-9]{2}[0-9]{1}[0-9]{2}[0-9]{8}$/)//regex.test(telefono);
    
    if(!flag){
      Swal.fire('Error', 'Error es necesario agregar correctamente el numero de telefono ejemplo: +5492223334444','error');
      return false;
    }

    Swal.showLoading();
    this.vendedorService.createVendedor(this.newFormVendedor.value).subscribe(data => {  
      if(data == true){
        Swal.fire('','Datos del nuevo vendedor creado con éxito!', 'success');

        this.newFormVendedor.reset();//patchValue({nombre:null, email:null, nrovendedor:null,telefono:null});        
        

        this.getVendedor();

        this.notificationModal.hide();
       }else{
        Swal.fire('Error, intnente de nuevo', 'error')
       }
    },  
    error => {  
      Swal.fire('Error, intnente de nuevo', 'error')
        console.log(error);  
    });  

  }
  asociarCliente(modalAsociar, row){

    this.clientes = [];
    Swal.showLoading();
    this.empresa.vendedor = row.id;
    this.notificationModal = this.modalService.show(modalAsociar,this.notification);
    this.getCliente();
  }
  getCliente(){
    this.descuentoCateService.getClienteAsociado(this.empresa).then( (res:any) =>{    
      Swal.close();
      this.clientes = res.response['clientes'];
      this.tempRowCliente = res.response['clientes'];
     
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  entriesChangeCliente($event){
    this.entriesCliente = $event.target.value;
  }
  filterTableCliente(event){

    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      let temRow = this.clientes.filter(function (d) {
        for (var key in d) {
          let hola = (d[key] != null) ? d[key].toLowerCase() : '';
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }
        return false;
      });
      this.clientes = temRow;
    }else{
      this.clientes = this.tempRowCliente;
    }  
  }

  onActivateCliente(event) {
    this.activeRowCliente = event.row;
  }

  desasociar(row){

    let datos = {
      empresa_id: this.empresa.id,
      vendedor:this.empresa.vendedor,
      nrocliente: row.nrocliente
    };
    Swal.fire({
      title: 'Seguro de Desasociar?',
      text: "Se eliminara la relacion entre el vendedor y el cliente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Desasociar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          Swal.showLoading();  
          this.descuentoCateService.desasociar(datos).then( (res:any) =>{    
            
            if(res.response){
              Swal.fire('Listo!','Desasociado correctamente con éxito!', 'success')
              this.notificationModal.hide();
            }else{
              Swal.fire('Error, intente nuevamente', 'error')
            }

          }).catch(err=>{

            Swal.fire('Error, intente nuevamente', 'error')
            console.log(err);
          });
          
        }
      })
  }
  asociar(row){

    let datos = {
      empresa_id: this.empresa.id,
      vendedor:this.empresa.vendedor,
      nrocliente: row.nrocliente
    };
    Swal.fire({
      title: 'Seguro de Asociar?',
      text: "Se creara una relacion entre el vendedor y el cliente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Asociar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {  
          Swal.showLoading();  
          this.descuentoCateService.asociar(datos).then( (res:any) =>{    

            if(res.response){
              Swal.fire('Listo!','Asociado correctamente con éxito!', 'success') 
              // this.notificationModal.hide();
              this.getCliente();

            }else{
              Swal.fire('Error, intente nuevamente', 'error')
            }              
          
          }).catch(err=>{
            Swal.fire('Error, intente nuevamente', 'error')
            console.log(err);
          });
        }
      })
  }

}

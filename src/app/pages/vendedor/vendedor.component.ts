import { Component, OnInit } from '@angular/core';
import {VendedorService } from '../../service/vendedor/vendedor.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';//importar para formular envio de todos los parametros
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { Router } from '@angular/router'; //para redireccionar las vistas
import * as XLSX from 'xlsx'; 
import {TranslateService} from '@ngx-translate/core';
import { ValidationService } from '../../service/validation/validation.service';

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

  // RESTROS LOG VAR
  entrieslog: number = 10;
  tempRowLog:any = [];
  logRow:any =[];

  rows: any = [];
  
  reorderable = true;
  SelectionType = SelectionType;
  btnvisibility: boolean = true;  
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg static", 
  };
  empresa:any = {id:''}; 
  constructor(private router: Router,private vendedorService: VendedorService,private modalService: BsModalService,private formBuilder: FormBuilder, public translate: TranslateService) {
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
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
      email: ['', Validators.required],
      clave: ['', Validators.required],
      lista: [''],
      archivo: [''],
    });

    this.newFormVendedor = this.formBuilder.group({
      nombre: ['',Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      clave: ['', Validators.required],
      usuario: ['',Validators.required],
      gerencia: [''],
      empresa_id: [''],
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
    this.addForm.setValue({id:row.id, nombre:row.nombre, email:row.email, clave:row.clave, lista: hola['lista'], archivo:hola['baja']});
    this.btnvisibility = false;  

  }
  onUpdate(){
    
    this.vendedorService.updateVendedor(this.addForm.value).subscribe(data => {  
      if(data == true){
        Swal.fire('guardado el vendedor, con exito!', 'success')
        this.addForm.reset();
        this.getVendedor();
        this.notificationModal.hide();
       }else{
        Swal.fire('Error, intnente de nuevo', 'error')
       }
    },  
    error => {  
        alert(error);  
    });  
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  logLogin(modalLog,vendedor){
    this.notificationModal = this.modalService.show(modalLog,this.notification);

    this.vendedorService.getLog(vendedor).then( (res:any) =>{
      if(res.success == true){
        this.logRow = res.logs;
        this.tempRowLog = res.logs;
      }else{
        //no hay registros 
      }
      
    }).catch(err=>{
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
    console.log(this.newFormVendedor.value);

    this.vendedorService.createVendedor(this.newFormVendedor.value).subscribe(data => {  
      if(data == true){
        Swal.fire('guardado el vendedor, con exito!', 'success')
        this.newFormVendedor.patchValue({empresa_id: '',nombre:'', email:'',clave: '', usuario:'',gerencia:'' });        
        this.getVendedor();

        this.notificationModal.hide();
       }else{
        Swal.fire('Error, intnente de nuevo', 'error')
       }
    },  
    error => {  
        alert(error);  
    });  

  }
  
}

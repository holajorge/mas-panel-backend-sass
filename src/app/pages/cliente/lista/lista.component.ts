import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import * as moment from 'moment';
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styles: []
})
export class ListaComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresaData:any = {id: ''};
  comprobantes:any = [];
  tempRow:any = [];
  formConfig:any = [];
  clientes:any = [];
  form_dataConfig:any = [];
  entries: number = 10;
  activeRow:any;
  flagAdd:boolean = false;
  constructor(
    public translate: TranslateService,  
    public fb: FormBuilder,
    private clienteService: ClienteService,
    private modalService: BsModalService
  ) { 
    this.translate.use('es');
    this.empresaData.id = localStorage.getItem('usuario');
    this.formConfig = this.fb.group({
      id: [''],
      cliente: ['',Validators.required],
      fecha: ['',Validators.required],
      documento: [''],   
      doc: ['']  
    });
  }

  ngOnInit() {
    this.getComprobantes();
    this.getCliente();

  }
  getCliente(){
    this.clienteService.getcliente(this.empresaData).then( (res:any) =>{    
      this.clientes = res.pedidos['clientes'];
    }).catch(err=>{
      console.log(err);
    });
  }
  getComprobantes(){ 
    this.clienteService.getComprobantes(this.empresaData).then( (res:any) =>{    
      
      this.comprobantes = res.pedidos['comprobantes'];
      this.tempRow = res.pedidos['comprobantes'];
      
    }).catch(err=>{
      console.log(err);
    });
  }
  delete(row){

    Swal.fire({
      title: 'Confirma que quiere eliminar el comprobante?',
      text: "Eliminar Comprobante!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
      if (result.value) {
        this.clienteService.deleteComprobante(row).then( (res:any) =>{    
          
          if(res.response){
            Swal.fire('Listo!','Comprobante eliminado con éxito!', 'success')
            this.getComprobantes();
          }else{
            Swal.fire('Error al eliminar, intente de nuevo!', 'error')
          }
          
        }).catch(err=>{
          console.log(err);
        });
      }

    })

  }
  editar(modalEdit, row){

    this.flagAdd = false;
    this.notificationModal = this.modalService.show(
      modalEdit,
      this.notification
    );
    this.formConfig.setValue({
      cliente:row.nrocliente, 
      fecha:moment(row.fechacomprobante).format('YYYY-MM-DDTkk:mm'), 
      id: row.id,
      doc: '',
      documento: ''
    });  

  }
  showPreviewHeader(event) {
    const file = (event.target as HTMLInputElement).files[0];    
    const files:FileList = event.target.files;    
    this.formConfig.patchValue({logo: file});
    this.formConfig.get('documento').updateValueAndValidity();

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){        

        let formData = new FormData();        
        formData.append('documento', (event.target as HTMLInputElement).files[0], file.name);
        this.form_dataConfig = formData;

      }else{
        Swal.fire('Error al importar o archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }  
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  update(){
    Swal.showLoading();
    let formData = new FormData();
    if(Array.isArray(this.form_dataConfig)){      
    }else{
      formData.append('file', this.form_dataConfig.get('documento'));    
    }    
    formData.append('id',this.formConfig.get('id').value);
    formData.append('nrocliente',  this.formConfig.get('cliente').value);
    formData.append('fecha_comprobante',  this.formConfig.get('fecha').value);
    
    this.clienteService.updateComprobante(formData).then( (res:any) =>{    
      Swal.close();
      if(res.response){
        Swal.fire('Listo!','Comprobante actualizado con éxito!', 'success')
        this.getComprobantes();
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error')
      }
      this.notificationModal.hide();
    }).catch(err=>{
      console.log(err);
    });

  }
  viewCourseTrainings(row){
    window.open(row.link, "_blank");
  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      const temRow = this.comprobantes.filter(function (d) {
      
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
      this.comprobantes = temRow;
    }else{
      this.comprobantes = this.tempRow;
    }    
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  addComprobante(modal){
    
    this.formConfig.reset();
    this.flagAdd = true;
    this.notificationModal = this.modalService.show(modal,this.notification);
    
  }

  registrar(){
    Swal.showLoading();
    let formData = new FormData();
    if(Array.isArray(this.form_dataConfig)){      
    }else{
      formData.append('file', this.form_dataConfig.get('documento'));    
    }    
    formData.append('empresa_id',this.empresaData.id);
    formData.append('nrocliente',  this.formConfig.get('cliente').value);
    formData.append('fecha_comprobante',  this.formConfig.get('fecha').value);
    
    this.clienteService.saveComprobante(formData).then( (res:any) =>{    
      Swal.close();
      if(res.response){
        this.formConfig.reset();
        this.form_dataConfig = [];
        this.getComprobantes();
        this.notificationModal.hide();

        Swal.fire('Listo!','Comprobante agregado con éxito!', 'success')
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.fire('Error al guardar, intente de nuevo!', 'error')
      console.log(err);
    });

  }
}

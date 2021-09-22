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
      title: 'segurdo de Eliminar?',
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
            Swal.fire('Listo!','Comprobante eliminado con exito!', 'success')
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

    
    this.notificationModal = this.modalService.show(
      modalEdit,
      this.notification
    );
    console.log(row);
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
        Swal.fire('Listo!','Comprobante actualizado con exito!', 'success')
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
    console.log(row);
    window.open(row.link, "_blank");
  }



}

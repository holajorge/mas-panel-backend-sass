import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClienteService } from 'src/app/service/cliente/cliente.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: []
})
export class AgregarComponent implements OnInit {
  formConfig:any = [];
  empresa:any = "";
  empresaData:any = {id: ''};
  clientes:any = [];
  form_dataConfig:any = [];
  constructor(
    public translate: TranslateService,  
    public fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.translate.use('es');
    this.empresaData.id = localStorage.getItem('usuario');
    this.formConfig = this.fb.group({
      cliente: ['',Validators.required],
      fecha: ['',Validators.required],
      documento: [''],   
      doc: ['',Validators.required]  
    });

  }

  ngOnInit() {
    this.getCliente();
  }
  getCliente(){
    this.clienteService.getcliente(this.empresaData).then( (res:any) =>{    
      this.clientes = res.pedidos['clientes'];
    }).catch(err=>{
      console.log(err);
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
      console.log(res);
      if(res.response){
        this.formConfig.reset();
        this.form_dataConfig = [];
        Swal.fire('Listo!','Comprobante agregado con exito!', 'success')
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.fire('Error al guardar, intente de nuevo!', 'error')
      console.log(err);
    });

  }

}

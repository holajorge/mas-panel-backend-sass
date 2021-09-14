import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfigService } from 'src/app/service/config/config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styles: []
})
export class GeneralComponent implements OnInit {
  
  empresa:any = "";
  empresaData:any = {id: ''};
  formConfig:any = [];
  configuraciones:any;

  constructor(public translate: TranslateService,  
    public fb: FormBuilder, 
    public configService: ConfigService)
  {
    this.translate.use('es');

    this.empresa = localStorage.getItem('usuario');
    
    this.formConfig = this.fb.group({
      aprobar_usuario: [''],
      permitir_registracion: [''],
      send_whatspp: [''],
      invitado: [null],
      empresa_id:  this.empresa,
    });
    this.empresaData.id = this.empresa;
  }
  ngOnInit() {
    this.getConfig();
  }
  getConfig(){
    Swal.showLoading();

    this.configService.getConfigEmpresa(this.empresaData).then( (res:any) =>{    
      Swal.close();      
      if(res.response.body['configuraciones'] != ""){
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
        this.formConfig.patchValue({
          // dominio: this.configuraciones.dominio,
          // subdominio: this.configuraciones.subdominio,
          // color_botones: this.configuraciones.color_botones,
          aprobar_usuario: (this.configuraciones.aprobar_automaticamente_usuario == "true" || this.configuraciones.aprobar_automaticamente_usuario == "1") ? 1 : 0 ,
          permitir_registracion: (this.configuraciones.permitir_registracion == "true" || this.configuraciones.permitir_registracion == "1") ? 1 : 0,
          send_whatspp: (this.configuraciones.pedido_whatsapp == "true" || this.configuraciones.pedido_whatsapp == "1") ? 1: 0,
          invitado: (this.configuraciones.invitado=="true" || this.configuraciones.invitado=="1" ) ? 1 : 0,
          // descripcion_empresa: this.configuraciones.descripcion_empresa,
          // nombre_empresa: this.configuraciones.nombre_empresa,
          // direccion: this.configuraciones.direccion,
          // telefono: this.configuraciones.telefono,
          // correo: this.configuraciones.correo,
        });
      }
      
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  registrarConfig(){
    
    Swal.showLoading();
    let formData = new FormData();
    formData.append('aprobar_user',  this.formConfig.get('aprobar_usuario').value);
    formData.append('permitir_registracion',  this.formConfig.get('permitir_registracion').value);
    formData.append('send_whatspp',  this.formConfig.get('send_whatspp').value);
    formData.append('invitado',  this.formConfig.get('invitado').value);
    formData.append('empresa_id',this.formConfig.get('empresa_id').value);

    this.configService.saveGenerales(formData).then( (res:any) =>{    
      Swal.close();
      if(res.response.body.flag == true){

        Swal.fire('Listo!','configuración de dominios guardada con exito!', 'success');
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error');
      }
    }).catch(err=>{
      console.log(err);
    });

  }
}

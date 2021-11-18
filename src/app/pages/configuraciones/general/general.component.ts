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
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  
  empresa:any = "";
  empresaData:any = {id: ''};
  formConfig:any = [];
  configuraciones:any;
  form_dataConfig:any=[];

  constructor(
    public translate: TranslateService,  
    public fb: FormBuilder, 
    public configService: ConfigService
  )
  {
    this.translate.use('es');

    this.empresa = localStorage.getItem('usuario');
    
    this.formConfig = this.fb.group({
      aprobar_usuario: [''],
      permitir_registracion: [''],
      send_whatspp: [''],
      invitado: [null],
      empresa_id:  this.empresa,
      descarga_excel: [''],
      markup: [''],
      comprobantes: [''],
      num_whatsapp: [null],
      url_facebook: [null],
      url_instagram: [null],
      qr_afip: [null],
      url_web: [null]
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
          descarga_excel: (this.configuraciones.descarga_excel=="true" || this.configuraciones.descarga_excel=="1" ) ? 1 : 0,
          markup: (this.configuraciones.markup=="true" || this.configuraciones.markup=="1" ) ? 1 : 0,
          comprobantes: (this.configuraciones.comprobantes=="true" || this.configuraciones.comprobantes=="1" ) ? 1 : 0,
          num_whatsapp: this.configuraciones.num_whatsapp,
          url_facebook: (this.configuraciones.url_facebook=="" || this.configuraciones.url_facebook=="undefined" || this.configuraciones.url_facebook==undefined) ? "" : this.configuraciones.url_facebook,
          url_instagram: (this.configuraciones.url_instagram=="" || this.configuraciones.url_instagram=="undefined" || this.configuraciones.url_instagram==undefined) ? "" : this.configuraciones.url_instagram,
          url_web: (this.configuraciones.url_web=="" || this.configuraciones.url_web=="undefined" || this.configuraciones.url_web==undefined) ? "" : this.configuraciones.url_web,
          qr_afip: (this.configuraciones.qr_afip=="" || this.configuraciones.qr_afip=="undefined" || this.configuraciones.qr_afip==undefined) ? "" : this.configuraciones.qr_afip,
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
    formData.append('descarga_excel',this.formConfig.get('descarga_excel').value);
    formData.append('markup',this.formConfig.get('markup').value);
    formData.append('comprobantes',this.formConfig.get('comprobantes').value);
    formData.append('num_whatsapp',  this.formConfig.get('num_whatsapp').value);
    formData.append('url_facebook',  this.formConfig.get('url_facebook').value);
    formData.append('url_instagram',  this.formConfig.get('url_instagram').value);
    formData.append('url_web',  this.formConfig.get('url_web').value);
    formData.append('qr_afip',  this.formConfig.get('qr_afip').value);
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

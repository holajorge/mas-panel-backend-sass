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
  imageURLogo: string;
  form_dataConfig:any=[];

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
      logo_mobile: [null],
      logo_mobile_file: [null],
      descarga_excel: [''],
      markup: [''],
      comprobantes: [''],
      num_whatsapp: [null],
      url_facebook: [null],
      url_instagram: [null],
      qr_afip: [null]
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
          qr_afip: (this.configuraciones.qr_afip=="" || this.configuraciones.qr_afip=="undefined" || this.configuraciones.qr_afip==undefined) ? "" : this.configuraciones.qr_afip,
          // descripcion_empresa: this.configuraciones.descripcion_empresa,
          // nombre_empresa: this.configuraciones.nombre_empresa,
          // direccion: this.configuraciones.direccion,
          // telefono: this.configuraciones.telefono,
          // correo: this.configuraciones.correo,
        });

        if(this.configuraciones.logo_mobile == '' || this.configuraciones.logo_mobile == undefined){
          this.imageURLogo = "";
        }else{
          this.imageURLogo = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.logo_mobile;
        }
      }
      
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  registrarConfig(){
    
    Swal.showLoading();
    let formData = new FormData();
    if(Array.isArray(this.form_dataConfig)){}
    else{
      formData.append('logo_mobile_file', this.form_dataConfig.get('logo_mobile_file'));
    }

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

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const files:FileList = event.target.files;
    this.formConfig.patchValue({logo_mobile_file: file});
    this.formConfig.get('logo_mobile_file').updateValueAndValidity();
    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('logo_mobile_file', (event.target as HTMLInputElement).files[0], file.name);
        this.form_dataConfig = formData;
      }else{
        Swal.fire('Error al importar o archivo excede o limite de tamaño permitido, intente de nuevo!', 'error');
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = () => {

      var img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
          if(img.width != 512 || img.height != 512){
            Swal.fire('Error al importar: la imagen debe ser de 512 x 512!', 'error');
            this.deleteImage();
            return;
          }
      }
      this.imageURLogo = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  deleteImage(){
    this.imageURLogo = "";
    this.form_dataConfig.delete('logo_mobile_file');
    this.formConfig.patchValue(
      {logo_mobile:''}
    );

  }

}

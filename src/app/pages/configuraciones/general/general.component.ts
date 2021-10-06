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

        if(this.configuraciones.logo_mobile_file == '' || this.configuraciones.logo_mobile_file == undefined){
          this.imageURLogo = "";
        }else{
          this.imageURLogo = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.logo_mobile_file;
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

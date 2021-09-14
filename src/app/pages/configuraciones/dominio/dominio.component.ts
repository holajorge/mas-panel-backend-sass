import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfigService } from 'src/app/service/config/config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-dominio',
  templateUrl: './dominio.component.html',
  styles: []
})
export class DominioComponent implements OnInit {
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
      dominio: [null,Validators.required],
      subdominio: [''],
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
          dominio: this.configuraciones.dominio,
          subdominio: this.configuraciones.subdominio,
          // color_botones: this.configuraciones.color_botones,
          // aprobar_usuario: this.configuraciones.aprobar_automaticamente_usuario,
          // permitir_registracion: this.configuraciones.permitir_registracion,
          // send_whatspp: this.configuraciones.pedido_whatsapp,
          // invitado: this.configuraciones.invitado,
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
    
    let formData = new FormData();
    formData.append('dominio',  this.formConfig.get('dominio').value);
    formData.append('subdominio',  this.formConfig.get('subdominio').value);
    formData.append('empresa_id',this.formConfig.get('empresa_id').value);

    Swal.showLoading();

    this.configService.saveDominio(formData).then( (res:any) =>{    
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

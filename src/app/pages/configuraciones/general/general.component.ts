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
      stock_descontar: [null],
      stock_permitir: [null],
      url_web: [null],
      leyenda_mas_iva: [null],
      sin_precio: [null],
      sin_codigo: [null],
      hora: [''],
      monto_minimo: [null],
      pedido_firebase: [null],
      cantidad_minima_carrito: [null],
      label_precio: [null],
      semaforo: [null],
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
          stock_permitir: (this.configuraciones.stock_permitir=="true" || this.configuraciones.stock_permitir=="1" ) ? 1 : 0,
          stock_descontar: (this.configuraciones.stock_descontar=="true" || this.configuraciones.stock_descontar=="1" ) ? 1 : 0,
          leyenda_mas_iva: (this.configuraciones.leyenda_mas_iva=="true" || this.configuraciones.leyenda_mas_iva=="1" ) ? 1 : 0,
          sin_precio: (this.configuraciones.sin_precio=="true" || this.configuraciones.sin_precio=="1" ) ? 1 : 0,
          sin_codigo: (this.configuraciones.sin_codigo=="true" || this.configuraciones.sin_codigo=="1" ) ? 1 : 0,
          pedido_firebase: (this.configuraciones.pedido_firebase=="true" || this.configuraciones.pedido_firebase=="1" ) ? 1 : 0,

          hora: (this.configuraciones.hora=="" || this.configuraciones.hora=="undefined" || this.configuraciones.hora==undefined) ? "" : this.configuraciones.hora,
          monto_minimo: (this.configuraciones.monto_minimo=="" || this.configuraciones.monto_minimo=="undefined" || this.configuraciones.monto_minimo==undefined) ? "" : this.configuraciones.monto_minimo,
          cantidad_minima_carrito: (this.configuraciones.cantidad_minima_carrito=="" || this.configuraciones.cantidad_minima_carrito=="undefined" || this.configuraciones.cantidad_minima_carrito==undefined) ? "" : this.configuraciones.cantidad_minima_carrito,
          label_precio: (this.configuraciones.label_precio=="" || this.configuraciones.label_precio=="undefined" || this.configuraciones.label_precio==undefined) ? "" : this.configuraciones.label_precio,
          semaforo: (this.configuraciones.semaforo=="" || this.configuraciones.semaforo=="undefined" || this.configuraciones.semaforo==undefined) ? "" : this.configuraciones.semaforo,
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
    formData.append('stock_permitir',  this.formConfig.get('stock_permitir').value);
    formData.append('stock_descontar',  this.formConfig.get('stock_descontar').value);
    formData.append('leyenda_mas_iva',  this.formConfig.get('leyenda_mas_iva').value);
    formData.append('sin_codigo',  this.formConfig.get('sin_codigo').value);
    formData.append('sin_precio',  this.formConfig.get('sin_precio').value);
    formData.append('pedido_firebase',  this.formConfig.get('pedido_firebase').value);
    formData.append('hora',  this.formConfig.get('hora').value);
    formData.append('monto_minimo',  this.formConfig.get('monto_minimo').value);
    formData.append('cantidad_minima_carrito',  this.formConfig.get('cantidad_minima_carrito').value);
    formData.append('label_precio',  this.formConfig.get('label_precio').value);
    formData.append('semaforo',  this.formConfig.get('semaforo').value);
    this.configService.saveGenerales(formData).then( (res:any) =>{
      Swal.close();
      if(res.response.body.flag == true){

        Swal.fire('Listo!','Configuración guardada con éxito!', 'success');
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error');
      }
    }).catch(err=>{
      console.log(err);
    });

  }
}

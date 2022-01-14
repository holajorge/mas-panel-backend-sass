import { Component, OnInit,Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfigService } from 'src/app/service/config/config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

const I18N_VALUES = {
  'pt': {
    weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dez'],
    weekLabel: 'sem'
  }
};

@Injectable()
export class I18n {
  language = 'pt';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) { super(); }

  getWeekdayShortName(weekday: number): string { return I18N_VALUES[this._i18n.language].weekdays[weekday - 1]; }
  getWeekLabel(): string { return I18N_VALUES[this._i18n.language].weekLabel; }
  getMonthShortName(month: number): string { return I18N_VALUES[this._i18n.language].months[month - 1]; }
  getMonthFullName(month: number): string { return this.getMonthShortName(month); }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.day}-${date.month}-${date.year}`; }
}
@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss']
})
export class ConfiguracionesComponent {
  
  formConfig:any = [];
  empresa:any = "";
  form_dataConfig:any=[];
  form_dataConfigMobile:any=[];
  color:string="";
  empresaData:any = {id: ''};
  configuraciones:any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Texto aqui',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };  
  imageURLogo: string;
  imageURLogoMobile: string;
  chico:boolean = false;
  mediano:boolean = false;
  grande:boolean = false;
  
  constructor(public translate: TranslateService,  public fb: FormBuilder, public configService: ConfigService) { 
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
    this.formConfig = this.fb.group({
      nombre_empresa: [null],
      direccion: [null],
      telefono: [null],
      correo: [null],
      logoo: [null],
      logo: [null],
      logo_mobile: [null],
      logo_mobile_file: [null],
      color_botones: [''],
      empresa_id:  this.empresa,
      descripcion_empresa: [''],
      hora: [''],
      size_foto: [''],
      monto_minimo: [null]
    });
    this.empresaData.id = this.empresa;
    this.getConfig();
  }
  getConfig(){
    Swal.showLoading();
    
    this.configService.getConfigEmpresa(this.empresaData).then( (res:any) =>{    
      Swal.close();      
      
      if(res.response.body['configuraciones'] != ""){
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
      //  console.log('CONFIGURACIONES', this.configuraciones);
        this.chico = (this.configuraciones.size_foto == 1) ? true : false;
        this.mediano = (this.configuraciones.size_foto == 2) ? true : false;
        this.grande = (this.configuraciones.size_foto == 3) ? true : false;

        if (this.configuraciones.size_foto == undefined || this.configuraciones.size_foto === undefined){
          this.mediano = true;
          this.configuraciones.size_foto = 2;
        } 

        if(this.configuraciones.direccion == "undefined"){
          this.configuraciones.direccion = "";
        }

        if(this.configuraciones.telefono == "undefined"){
          this.configuraciones.telefono = "";
        }

        if(this.configuraciones.hora == "undefined"){
          this.configuraciones.hora = "";
        }
        
        if(this.configuraciones.descripcion_empresa == "undefined"){
          this.configuraciones.descripcion_empresa = "";
        }

        this.formConfig.patchValue({
          color_botones: this.configuraciones.color_botones,
          descripcion_empresa: this.configuraciones.descripcion_empresa,
          nombre_empresa: this.configuraciones.nombre_empresa,
          direccion: this.configuraciones.direccion,
          telefono: this.configuraciones.telefono,
          correo: this.configuraciones.correo,
          hora: this.configuraciones.hora,
          size_foto: this.configuraciones.size_foto,
          monto_minimo: this.configuraciones.monto_minimo
        });

        if(this.configuraciones.logo == '' || this.configuraciones.logo == undefined){ 
          
          this.imageURLogo = "";
        }else{          
              
          this.imageURLogo = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.logo;
        }

        if(this.configuraciones.logo_mobile == '' || this.configuraciones.logo_mobile == undefined){
          this.imageURLogoMobile = "";
        }else{
          this.imageURLogoMobile = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.logo_mobile;
        }

      }
      
    }).catch(err=>{
      Swal.close();      

      console.log(err);
    });
  }
  showPreviewHeader(event) {
    const file = (event.target as HTMLInputElement).files[0];    
    const files:FileList = event.target.files;    
    this.formConfig.patchValue({logo: file});
    this.formConfig.get('logo').updateValueAndValidity();

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){        

        let formData = new FormData();
        // console.log(file);
        // console.log(file.name);
        formData.append('logo', (event.target as HTMLInputElement).files[0], file.name);
        // formData.append('empresa_id',this.formConfig.get('empresa_id').value); 
        // console.log(formData);
        this.form_dataConfig = formData;
        // console.log(this.form_dataConfig);
        // this.formConfig.patchValue({filesource: files});
        // console.log(this.form_dataConfig.get('logo'));
        // File Preview        

      }else{
        Swal.fire('Error al importar o archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURLogo = reader.result as string;
    }
    reader.readAsDataURL(file)
  
  }
  deleteImage(){
    this.imageURLogo = "";
    this.form_dataConfig.delete('logo');
    this.formConfig.patchValue(
      {logoo:''}
    );
    
  }

  deleteImageMobile(){
    this.imageURLogoMobile = "";
    this.form_dataConfigMobile.delete('logo_mobile_file');
    this.formConfig.patchValue(
      {logo_mobile:''}
    );
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
        this.form_dataConfigMobile = formData;
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
            this.deleteImageMobile();
            return;
          }
      }
      this.imageURLogoMobile = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  registrarConfig(){
    
    Swal.showLoading();

    
    let formData = new FormData();
    if(Array.isArray(this.form_dataConfig)){}else{
      formData.append('logo', this.form_dataConfig.get('logo'));
    }

    if(Array.isArray(this.form_dataConfigMobile)){}else{
      formData.append('logo_mobile_file', this.form_dataConfigMobile.get('logo_mobile_file'));
    }
    // return false;
    formData.append('empresa_id',this.formConfig.get('empresa_id').value);
    formData.append('color_botones',  this.color);
    // formData.append('aprobar_user',  this.formConfig.get('aprobar_usuario').value);
    // formData.append('permitir_registracion',  this.formConfig.get('permitir_registracion').value);
    // formData.append('dominio',  this.formConfig.get('dominio').value);
    // formData.append('send_whatspp',  this.formConfig.get('send_whatspp').value);
    // formData.append('invitado',  this.formConfig.get('invitado').value);
    formData.append('descripcion_empresa',  this.formConfig.get('descripcion_empresa').value);

    formData.append('nombre_empresa',  this.formConfig.get('nombre_empresa').value);
    formData.append('direccion',  this.formConfig.get('direccion').value);
    formData.append('telefono',  this.formConfig.get('telefono').value);
    formData.append('correo',  this.formConfig.get('correo').value);
    formData.append('hora',  this.formConfig.get('hora').value);
    formData.append('size_foto',  this.formConfig.get('size_foto').value);
    formData.append('monto_minimo',  this.formConfig.get('monto_minimo').value);
    
    this.configService.saveConfig(formData).then( (res:any) =>{    
      Swal.close();
      if(res.response.body.flag == true){
        location.reload();
        // this.getConfig();

        Swal.fire('Listo!','configuración guardada con exito!', 'success')
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });

  }
}

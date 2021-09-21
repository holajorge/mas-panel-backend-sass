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
  form_dataConfigValue:any=[];
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
  chico:boolean = false;
  mediano:boolean = false;
  grande:boolean = false;
  
  constructor(public translate: TranslateService,  public fb: FormBuilder, public configService: ConfigService) { 
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
    
    this.formConfig = this.fb.group({
      nombre_empresa: [null],
      direccion: [null],
      telefono: [null],
      correo: [null],
      logoo: [null],
      logo: [null],
      color_botones: [''],
      empresa_id:  this.empresa,
      descripcion_empresa: [''],
      hora: [''],
      size_foto: ['']
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
        console.log(this.configuraciones.size_foto);
        this.chico = (this.configuraciones.size_foto == 1) ? true : false;
        this.mediano = (this.configuraciones.size_foto == 2) ? true : false;
        this.grande = (this.configuraciones.size_foto == 3) ? true : false;
        this.formConfig.patchValue({
          color_botones: this.configuraciones.color_botones,
          descripcion_empresa: this.configuraciones.descripcion_empresa,
          nombre_empresa: this.configuraciones.nombre_empresa,
          direccion: this.configuraciones.direccion,
          telefono: this.configuraciones.telefono,
          correo: this.configuraciones.correo,
          hora: this.configuraciones.hora,
          size_foto: this.configuraciones.size_foto
        });

        if(this.configuraciones.logo == '' || this.configuraciones.logo == undefined){ 
          
          this.imageURLogo = "";
        }else{          
              
          this.imageURLogo = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.logo;
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
  registrarConfig(){
    
    Swal.showLoading();

    
    let formData = new FormData();
    if(Array.isArray(this.form_dataConfig)){
      
    }else{
      
      formData.append('logo', this.form_dataConfig.get('logo'));    

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
    
    this.configService.saveConfig(formData).then( (res:any) =>{    
      Swal.close();
      if(res.response.body.flag == true){

        Swal.fire('Listo!','configuracion guardada con exito!', 'success')
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });

  }
}

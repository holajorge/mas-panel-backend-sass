import { Component, OnInit,Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfigService } from 'src/app/service/config/config.service';

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
export class ConfiguracionesComponent implements OnInit {
  
  formConfig:any = [];
  empresa:any = "";
  form_dataConfig:any=[];
  form_dataConfigValue:any=[];
  color:string="";
  constructor(public translate: TranslateService,  public fb: FormBuilder, public configService: ConfigService) { 
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.formConfig = this.fb.group({
      dominio: [null],
      logoo: [null],
      logo: [null],
      color_botones: [''],
      aprobar_usuario: [''],
      permitir_registracion: [''],
      empresa_id:  this.empresa,
      send_whatspp: [''],

    });
  }
  showPreviewHeader(event) {
    // const file = (event.target as HTMLInputElement).files[0];    
    const files:FileList = event.target.files;    
    console.log(files);

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){

        this.formConfig.patchValue({logo: file});

        let formData = new FormData();
        formData.append('logo', file, file.name);
        formData.append('empresa_id',this.formConfig.get('empresa_id').value);        
        this.form_dataConfig = formData;

      }else{
        Swal.fire('Erro al importar o archivo excede o limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }
  
  }
  registrarConfig(){
    
    // this.formConfig.patchValue({color_botones: this.color});
    let formData = new FormData();
    formData.append('logo', this.form_dataConfig.get('logo'));
    formData.append('empresa_id',this.formConfig.get('empresa_id').value);
    formData.append('color_botones',  this.color);
    formData.append('aprobar_user',  this.formConfig.get('aprobar_usuario').value);
    formData.append('permitir_registracion',  this.formConfig.get('permitir_registracion').value);
    formData.append('dominio',  this.formConfig.get('dominio').value);
    formData.append('send_whatspp',  this.formConfig.get('send_whatspp').value);
    this.configService.saveConfig(formData).then( (res:any) =>{    
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

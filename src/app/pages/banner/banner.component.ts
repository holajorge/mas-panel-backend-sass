import { Component, OnInit,Injectable } from '@angular/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BannerService } from '../../service/banner/banner.service';
import Swal from "sweetalert2";

import Dropzone from "dropzone";
Dropzone.autoDiscover = false;
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
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] 

})
export class BannerComponent implements OnInit {
  empresa:any = "";
  imageURLHeader: string;
  imageURLFooter: string;
  imageURLSwal: string;
  uploadFormSwal: FormGroup;
  uploadFormFooter: FormGroup;
  uploadFormHeader: FormGroup;
  file_dataHeader:any = [];
  file_dataFooter:any = [];
  file_dataSwal:any = [];
  
  constructor(public translate: TranslateService, public fb: FormBuilder,
    public bannerService: BannerService
  ) { 
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');

    this.uploadFormSwal = this.fb.group({
      bannerr: [null,Validators.required],
      banner: [null],
      name: [''],
      empresa_id: this.empresa,
    });
    this.uploadFormFooter = this.fb.group({
      bannerr: [null,Validators.required],
      banner: [null],
      name: [''],
      empresa_id: this.empresa,
    });
    this.uploadFormHeader = this.fb.group({
      bannerr: [null,Validators.required],
      banner: [null],
      name: [''],
      empresa_id: this.empresa,

    });
  }

  ngOnInit() {
    
  }

  showPreviewHeader(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const files:FileList = event.target.files;  

    this.uploadFormHeader.patchValue({banner: file});
    this.uploadFormHeader.get('banner').updateValueAndValidity();

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id',this.uploadFormHeader.get('empresa_id').value);
        this.file_dataHeader=formData;
        this.uploadFormHeader.patchValue({filesource: files});
      }else{
        Swal.fire('Error al importar el arquivo excede el limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURLHeader = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  submitHeader() {
    this.bannerService.importBanner(this.file_dataHeader).then( (res:any) =>{    
      if(res.response.body.flag == true){
        Swal.fire('Listo!','Archivo de Header importado con exito!', 'success')
      }else{
        Swal.fire('Erro al importar Archivo de Header, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
    
  }
  deleteImage(url: any){
    this.imageURLHeader = "";
  }

  showPreviewFooter(event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.uploadFormFooter.patchValue({
      banner: file
    });
    this.uploadFormFooter.get('banner').updateValueAndValidity();

    const files:FileList = event.target.files;    

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id',this.uploadFormFooter.get('empresa_id').value);
        this.file_dataFooter=formData;
        this.uploadFormFooter.patchValue({filesource: files});
      }else{
        Swal.fire('Erro al importar o arquivo excede o limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURLFooter = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  submitFooter() {
    
    this.bannerService.importFooter(this.file_dataFooter).then( (res:any) =>{    
      if(res.response.body.flag == true){
        Swal.fire('Listo!','Archivo de Footer importado con exito!', 'success')
      }else{
        Swal.fire('Erro al importar Archivo de Footer, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  deleteImageFooter(url:any){

    this.imageURLFooter = "";

  }
  showPreviewSwal(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadFormSwal.patchValue({
      banner: file
    });
    this.uploadFormSwal.get('banner').updateValueAndValidity();

    const files:FileList = event.target.files;    

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id',this.uploadFormSwal.get('empresa_id').value);
        this.file_dataSwal=formData;
        this.uploadFormSwal.patchValue({filesource: files});
      }else{
        Swal.fire('Erro al importar o arquivo excede o limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURLSwal = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  submitSwal() {
    this.bannerService.importSwal(this.file_dataSwal).then( (res:any) =>{    
      if(res.response.body.flag == true){
        Swal.fire('Listo!','Archivo de Swal importado con exito!', 'success')
      }else{
        Swal.fire('Erro al importar Archivo de Swal, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  deleteImageSwal(url:any){

    this.imageURLSwal = "";

  }
}

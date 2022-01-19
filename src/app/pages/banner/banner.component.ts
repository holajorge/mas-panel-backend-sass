import { Component, OnInit,Injectable } from '@angular/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BannerService } from '../../service/banner/banner.service';
import Swal from "sweetalert2";
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  providers: [] 

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
  configuraciones:any;
  empresa_idd: any = {id:''};
  
  constructor(public translate: TranslateService, public fb: FormBuilder,
    public bannerService: BannerService,
   public configService: ConfigService,

  ) { 
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
    this.empresa_idd.id = localStorage.getItem('usuario');

    
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
    Swal.showLoading();
    this.configService.getConfigEmpresa(this.empresa_idd).then( (res:any) =>{    
      Swal.close();
      if(res.response.body['configuraciones'] != ""){
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
        
        // console.log(this.configuraciones); //return false;
        if(this.configuraciones.escritorios == '' || this.configuraciones.escritorios == undefined){ 
        
          this.imageURLHeader = "";
          this.imageURLFooter = "";
        }else{          
          
          this.imageURLHeader = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.escritorios;
          this.imageURLFooter = "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+res.response.body['bucket']+"/fotos/"+this.configuraciones.moviles;
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
        Swal.fire('Error al importar el archivo excede el limite de tamaño permitido, intente de nuevo!', 'error')
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
        Swal.fire('Listo!','Banner de escritorio importado con éxito!', 'success')
      }else{
        Swal.fire('Erro al importar Banner de escritorio, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
    
  }
  deleteImage(url: any){

    Swal.fire({
      title: 'Seguro de Eliminar?',
      text: "eliminará la imagen del banner para escritorios!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {

        if (result.value) {
        Swal.showLoading();

        this.bannerService.eliminarEscritorio(this.empresa_idd).then( (res:any) =>{    
          Swal.close();

          // console.log(res); return false;
          if(res.response['body'].flag == true){
            this.imageURLHeader = "";
            Swal.fire('Listo!','Banner de móviles importado con éxito!', 'success')
          }else{
            Swal.fire('Erro al importar Banner de móviles, intente de nuevo!', 'error')
          }
        }).catch(err=>{
          console.log(err);
        });
      }
    })

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
        Swal.fire('Error al importar el archivo excede el limite de tamaño permitido, intente de nuevo!', 'error')
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
        Swal.fire('Listo!','Banner de móviles importado con éxito!', 'success')
      }else{
        Swal.fire('Erro al importar Banner de móviles, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  deleteImageFooter(url:any){
    Swal.fire({
      title: 'Seguro de Eliminar?',
      text: "eliminará la imagen del banner para escritorios!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {

        if (result.value) {
          Swal.showLoading();
          
          this.bannerService.eliminarMovil(this.empresa_idd).then( (res:any) =>{    
            Swal.close();

            // console.log(res); return false;
            if(res.response['body'].flag == true){
              this.imageURLFooter = "";

              Swal.fire('Listo!','Banner de móviles importado con éxito!', 'success')
            }else{
              Swal.fire('Erro al importar Banner de móviles, intente de nuevo!', 'error')
            }
          }).catch(err=>{
            console.log(err);
          });
        }
    })
  }
  
  
}

import { Component, OnInit,Injectable } from '@angular/core';
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BannerService } from '../../service/banner/banner.service';
import Swal from "sweetalert2";
import { ConfigService } from 'src/app/service/config/config.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Banner } from 'src/app/models/banner.model';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  providers: [] 

})
export class BannerComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresa:any = "";
  imageURLHeader: string;
  imageURLMobil: string;
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
  bannerForm:FormGroup;
  flagAdd:boolean = false;
  listaTipo:any = [{nombre:'Banner',selected:true}, {nombre:'Aviso',selected:false}];
  file_dataDesktop:any = [];
  file_dataMovil:any = [];
  listBanners:Banner[] = [];
  entries: number = 10;
  bucket:string;
  columns = [{name: 'ruta Escritorio',prop: 'rutaescritorio'}, 
    { name: 'ruta movil',prop: 'rutamovil' },{ name: 'Tipo', }];
  show:boolean = false;
  flagBanners:boolean = false;
  flagBannersAviso:boolean = false;
  constructor(
    public translate: TranslateService, public fb: FormBuilder,
    public bannerService: BannerService,
    public configService: ConfigService,
    private modalService: BsModalService,
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
    this.bannerForm = this.fb.group({
      escritorio: [null,Validators.required],
      movil: [null],
      tipo: ['', Validators.required],
      id: [''],
    });    
  }
  ngOnInit() {
    
    Swal.showLoading();
    this.getConfig();
    this.getDataBanners();
  }
  getConfig(){
    this.configService.getConfigEmpresa(this.empresa_idd).then( (res:any) =>{    
      Swal.close();
      if(res.response.body['configuraciones'] != ""){
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
        console.log(this.configuraciones);
        this.bucket = res.response.body['bucket'];
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
  getDataBanners(){
    Swal.showLoading();
    let data = {id:this.empresa};
    this.bannerService.getDataBannes(data).subscribe( 
      banners => {        
        Swal.close();
        this.listBanners = banners;           
      },
      (error) => {
        console.log(error);        
        Swal.fire('Error', 'Error inesperado, intente de nuevo','error');        
      }
    )
    console.log(this.listBanners);
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
  showPreviewHeaderEscritorio(event){
    const file = (event.target as HTMLInputElement).files[0];
    const files:FileList = event.target.files;  
    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('logo', file);
        this.file_dataDesktop=formData;
      }else{
        Swal.fire('Error al importar el archivo excede el limite de tamaño permitido, intente de nuevo!', 'error')
        return false;
      }
    }    
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURLHeader = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  showPreviewHeaderMovil(event){
    const file = (event.target as HTMLInputElement).files[0];
    const files:FileList = event.target.files;  
    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('logo', file);
        this.file_dataMovil=formData;
      }else{
        Swal.fire('Error al importar el archivo excede el limite de tamaño permitido, intente de nuevo!', 'error')
        return false;
      }
    }    
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURLMobil = reader.result as string;
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
  // submitFooter() {
    
  //   this.bannerService.banner(this.file_dataFooter).then( (res:any) =>{    
  //     if(res.response.body.flag == true){
  //       Swal.fire('Listo!','Banner de móviles importado con éxito!', 'success')
  //     }else{
  //       Swal.fire('Erro al importar Banner de móviles, intente de nuevo!', 'error')
  //     }
  //   }).catch(err=>{
  //     console.log(err);
  //   });
  // }
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
  chekTypeBanner(){
    
    this.imageURLMobil = "";
    this.imageURLHeader = "";

    this.bannerForm.patchValue({escritorio: null});
    this.bannerForm.patchValue({movil: null});
    this.file_dataMovil = [];
    this.file_dataDesktop = [];

    if(this.bannerForm.get('tipo').value == "Banner"){
      this.show = true;
      this.flagBanners = true;
      this.flagBannersAviso = false;

    }else{
      //tipo aviso 
      this.show = true;
      this.flagBanners = false;
      this.flagBannersAviso = true;
      // this.imageURLMobil = "";
      // this.file_dataMovil = [];
      // this.bannerForm.patchValue( {movil: ''} ); 

    }

    if(this.bannerForm.get('tipo').value == null){
      this.show = false;
      this.bannerForm.invalid;
      this.imageURLMobil = "";
      this.imageURLHeader = "";

    }
  }
  addBannerModal(modal){
    this.bannerForm.reset();

    this.notificationModal = this.modalService.show(
      modal,
      this.notification
    );
    this.flagAdd = true;
    this.flagBanners = false;
    this.flagBannersAviso = false;
    this.imageURLHeader = '';
    this.imageURLMobil = '';

  }
  onSelectItem(modal,row){

    this.bannerForm.reset();

    this.notificationModal = this.modalService.show( modal,this.notification);
    this.flagAdd = false;
    this.bannerForm.patchValue({id:row.id});
    this.bannerForm.patchValue({tipo:row.tipo});
    // this.bannerForm.controls['escritorio'].setValidators([Validators.nullValidator]);

    if(row.tipo == "Banner"){
      this.show = true;
      this.flagBanners = true;
      this.flagBannersAviso = false;

      this.file_dataMovil = [];
      this.file_dataDesktop = [];
      
      this.imageURLHeader = (row.rutaescritorio) ? `https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/${this.bucket}/fotos/${row.rutaescritorio}` : '';
      this.imageURLMobil = (row.rutamovil) ? `https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/${this.bucket}/fotos/${row.rutamovil}` : '';
      //falta poner el img en el form data

    }else{
      this.show = true;
      this.flagBanners = false;
      this.flagBannersAviso = true;
      this.imageURLMobil = "";
      
      this.file_dataMovil = [];
      this.imageURLHeader = (row.rutaescritorio) ? `https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/${this.bucket}/fotos/${row.rutaescritorio}` : '';
      // this.imageURLMobil = (row.rutamovil) ? `https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/${this.bucket}/fotos/${row.rutamovil}` : '';
    }

  }
  addBanner(){
    let formData = new FormData();
    Swal.showLoading();
    formData.append('escritorio',this.file_dataDesktop.get('logo'));
    if(Array.isArray(this.file_dataMovil)){}else{
      formData.append('movil', this.file_dataMovil.get('logo'));
    }
    formData.append('tipo',this.bannerForm.get('tipo').value);
    formData.append('id',this.empresa);
    this.bannerService.banner(formData).subscribe(
      (flag) => {
        console.log(flag);
        
        if(flag){
          Swal.fire('Listo', 'Banners guardados con exito', 'success');
          this.getDataBanners();
          this.notificationModal.hide();
        }else{
          Swal.fire('error', 'No fue posible guardar los Banners, porfavor intente de nuevo', 'error');          
        }
      },
      (error)=> {
        console.log(error);        
        Swal.fire('error', 'No fue posible guardar los Banners, porfavor intente de nuevo', 'error');          
      }
    )
  }

  updateBanner(){
    let formData = new FormData();
    Swal.showLoading();
    // formData.append('escritorio',this.file_dataDesktop.get('logo'));
    if(Array.isArray(this.file_dataDesktop)){
      Swal.fire('Upps', 'Es necesario el banner de escritorio', 'warning');
    }else{
      formData.append('escritorio', this.file_dataDesktop.get('logo'));
    }
    if(Array.isArray(this.file_dataMovil)){}else{
      formData.append('movil', this.file_dataMovil.get('logo'));
    }
    formData.append('tipo',this.bannerForm.get('tipo').value);
    formData.append('banner_id',this.bannerForm.get('id').value);
    formData.append('id',this.empresa);
    this.bannerService.updateBanners(formData).subscribe(
      (flag) => {
        console.log(flag);
        
        if(flag){
          Swal.fire('Listo', 'Banners actualizados con exito', 'success');
          this.getDataBanners();
          this.notificationModal.hide();
        }else{
          Swal.fire('error', 'No fue posible actualizar los Banners, porfavor intente de nuevo', 'error');          
        }
      },
      (error)=> {
        console.log(error);        
        Swal.fire('error', 'No fue posible actualizar los Banners, porfavor intente de nuevo', 'error');          
      }
    )
  }
  deleteBanner(id){
    Swal.fire({
      title: 'Seguro de eliminar los Banners?',
      text: "Eliminar Banners!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          Swal.showLoading();
          let data = {banner:id, id:this.empresa};
          
          this.bannerService.eliminarBanner(data).subscribe(
            (flag) => {
              console.log(flag);
              
              if(flag){
                Swal.fire('Listo', 'Banners Eliminado con exito', 'success');
                this.getDataBanners();
                this.notificationModal.hide();
              }else{
                Swal.fire('error', 'No fue posible Eliminar los Banners, porfavor intente de nuevo', 'error');          
              }
            },
            (error)=> {
              console.log(error);        
              Swal.fire('error', 'No fue posible Eliminar los Banners, porfavor intente de nuevo', 'error');          
            }
          )
        }
    }) 
  }
}

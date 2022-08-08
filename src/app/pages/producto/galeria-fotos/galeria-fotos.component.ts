import { Component, OnInit,ViewChild, ElementRef, TemplateRef,Injectable } from '@angular/core';
import {TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ProductoService } from '../../../service/producto/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";

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
export abstract class TranslateParser {
  /**
   * Interpolates a string to replace parameters
   * "This is a {{ key }}" ==> "This is a value", with params = { key: "value" }
   * @param expr
   * @param params
   * @returns {string}
   */
  abstract interpolate(expr: string | Function, params?: any): string;
}

@Component({
  selector: 'app-galeria-fotos',
  templateUrl: './galeria-fotos.component.html',
  styleUrls: ['./galeria-fotos.component.scss']
})
export class GaleriaFotosComponent implements OnInit {
  empresa:any = "";
  photos:any = [];
  modalAsignarVar: BsModalRef;
  photo_to_assign = "";
  products:any = [];
  productOption:any = "";
  entries: number = 20;
  selectedProducts:any = [];
  configuraciones:any = [];
  textCaract1:any = "";
  textCaract2:any = "";
  textCaract3:any = "";
  photo_ampliada = {"uri": "", "width": "", "height": ""};


  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl",
  };

  constructor(private productoService: ProductoService, public translate: TranslateService,
              private modalService: BsModalService, private formBuilder: FormBuilder) {
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.getProductos();
    this.getPhotos();
  }

  getPhotos(){
    Swal.showLoading();
    this.productoService.getAllPhotos(this.empresa).then( (res:any) =>{
      if(res.success){
        Swal.close();
          this.photos = JSON.parse(res.response.body['listado']);
          console.log(this.photos)
      }else{
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  getProductos(){
    Swal.showLoading();
    this.productoService.getProducto(this.empresa).then( (res:any) =>{
      if(res.success){
        Swal.close();
        this.products = res.productos['productos'];
        this.configuraciones = res.productos['configuraciones'];
        if(this.configuraciones == false || this.configuraciones == null){
            this.textCaract1 = false;
            this.textCaract2 = false;
            this.textCaract3 = false;
        }else{
            this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : false;
            this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : false;
            this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : false;
        }
      }else{
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  asignar(modalAsignar, keyname) {
    this.selectedProducts = [];
    this.photo_to_assign = keyname.split("/").pop();
    this.modalAsignarVar = this.modalService.show(
      modalAsignar,
      this.notification
    );
  }

  photo_assign(){
    Swal.showLoading();
    this.productoService.photoAssign(this.empresa, this.photo_to_assign, this.selectedProducts).then( (res:any) =>{
      if(res.success){
        Swal.close();
        if(res.response.body){
            Swal.fire('Listo!','Foto asignada con éxito!', 'success');
        }else{
            Swal.fire('Upps!','Error al asignar la foto', 'error');
        }
      }else{
        console.log(res);
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      Swal.fire('Upps!','Error al asignar la foto', 'error');
      console.log(err);
    });
  }

  eliminar(keyname) {
    Swal.fire({
      title: 'Está seguro que desea eliminar esta foto? ' + keyname.split("/").pop(),
      text: "Eliminar foto del almacenamiento!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          Swal.showLoading();
          this.productoService.deletePhoto(this.empresa, keyname).then( (res:any) =>{
            if(res.success == true){
              Swal.fire('Listo!','Foto eliminada con éxito!', 'success')
              this.getPhotos();

            }else{
              Swal.fire('Upps!','Error al eliminar foto del almacenamiento, intente nuevamente!', 'error')
            }
          }).catch(err=>{
            Swal.fire('Upps!','Error al eliminar foto del almacenamiento, intente nuevamente!', 'error')
            console.log(err);
          });
        }
    })
  }

  onImgError(event){
    console.log(event);
  }
  onActivate(event) {
    //console.log(event.row);
  }

  selectListener(event){
    console.log(event.row);
  }

  getImageDimenstion(imgUrl){
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.src = imgUrl;
      img.onload =  function (event) {
                  let  loadedImage = <HTMLImageElement> event.currentTarget;
                  let width = loadedImage.width;
                  let height = loadedImage.height;

                 resolve({width,height})
             }
        img.onerror = reject
    })
  }

  public async ampliarImagen(photo, modalPhoto){
    await this.getImageDimenstion('https://maspedidos.s3.us-west-2.amazonaws.com/' + photo).then((res:any)=>{
        this.photo_ampliada = {"uri": photo, "width": res.width, "height": res.height};
        this.modalAsignarVar = this.modalService.show(
          modalPhoto,
          this.notification
        );
    });
  }
}

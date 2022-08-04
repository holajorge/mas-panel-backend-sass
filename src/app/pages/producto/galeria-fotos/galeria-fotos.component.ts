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

  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static modal-content-custom",
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
        this.products = [];
        res.productos['productos'].forEach((prod) => {
           let row = {id: prod["id"], name: prod["titulo"]};
           this.products = [...this.products, row];
        })
      }else{
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  asignar(modalAsignar, keyname) {
    this.photo_to_assign = keyname.split("/").pop();
    this.modalAsignarVar = this.modalService.show(
      modalAsignar
    );
  }

  photo_assign(){
    Swal.showLoading();
    this.productoService.photoAssign(this.empresa, this.photo_to_assign, this.productOption).then( (res:any) =>{
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

}

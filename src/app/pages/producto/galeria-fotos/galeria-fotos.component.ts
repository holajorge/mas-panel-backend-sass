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
  productos:any = [];
  bucket:string = "";
  empresa:any = "";

  constructor(private productoService: ProductoService, public translate: TranslateService) {
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.getProductos();
  }

  getProductos(){
    Swal.showLoading();
    this.productoService.getProducto(this.empresa).then( (res:any) =>{
      if(res.success){
        Swal.close();
          this.bucket = res.productos['empresa'].bucket;
          this.productos = [];
          res.productos['productos'].forEach((prod) => {
            prod['fotos'] = JSON.parse(prod['fotos']);
            this.productos.push(prod);
          })
      }else{
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  asignar(row) {
    console.log(row);
  }

  eliminar(row) {
    console.log(row);
  }

  onImgError(event){
    console.log(event);
  }

}

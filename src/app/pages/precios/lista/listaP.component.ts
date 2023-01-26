import { Component, OnInit } from '@angular/core';
import { PreciosService } from 'src/app/service/precios/precios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styles: []
})
export class ListaPComponent implements OnInit {
  empresaData:any = {id: ''};
  listaPrecios:any = [];
  listaPreciosTemp:any = [];
  listaPreciosTempFilter:any = [];
  collectionSize:number = this.listaPreciosTempFilter.length;
  page = 1;
  pageSize = 10;

  entries: number = 10;
  columnPrecios = [ 
    {prop:'lista',name:'Lista'}, 
    {prop:'codigo_producto', name: 'Producto'}, 
    {prop:'precio',name: 'Precio'},
    {prop:'precio_oferta',name: 'Precio oferta'},
  ]
  // lilter
  listaFilter:string = '';
  codigoProductFilter:string = '';

  constructor(public precioService:PreciosService) {  
    this.empresaData.id = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.getListaPrecios();
  }

  getListaPrecios(){
    this.precioService.getListaP(this.empresaData).subscribe( 
      (res) => {
        this.listaPrecios = res;        
        this.listaPreciosTemp = res;
        this.listaPreciosTempFilter = res;
        this.refreshDatos();
      },
      (error) => {

      },
    )
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  esMayuscula(letra){
    return letra === letra.toUpperCase();
}
  comprobarTexto(itemBusqueda, textoInput ){

    if(this.esMayuscula(textoInput)){
      textoInput = textoInput.toUpperCase();
      itemBusqueda = itemBusqueda.toUpperCase();
      
    }else{
      textoInput = textoInput.toLowerCase()
      itemBusqueda = itemBusqueda.toLowerCase();
      
    }
    if(itemBusqueda.includes(textoInput)){
      return true;
    }else{
      return false;
    }

  }
  filterTable() {
    const lista = this.listaFilter;
    const codigo = this.codigoProductFilter;

    const filtros = {
      lista: [lista, d => {
        if(this.comprobarTexto(d.lista,lista)){
          return true;
        }
      }], 
      codigo: [codigo, d => {
        console.log(d);
        
        if(this.comprobarTexto(d.codigoProducto,codigo)){
          return true;
        }
      }], 
    }
    let datos = this.listaPreciosTemp;
    for (const filtro in filtros) {
      if(filtros[filtro][0]){
        datos = datos.filter( filtros[filtro][1])
      }
    }
    this.listaPreciosTempFilter = datos;
    this.refreshDatos();

  }
  eliminar(){
    this.listaFilter = '';
    this.codigoProductFilter = '';
    //this.listaPrecios = this.listaPreciosTemp;
    this.refreshDatos();
  }
  refreshDatos() {
      this.collectionSize = this.listaPreciosTempFilter.length;
      this.listaPrecios = this.listaPreciosTempFilter.map(  (product, i) => ({id:i+1,...product})).slice(
                              (this.page - 1) * this.pageSize,
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
  }
}

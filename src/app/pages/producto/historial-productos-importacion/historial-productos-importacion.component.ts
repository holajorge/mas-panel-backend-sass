import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto/producto.service';



@Component({
  selector: 'app-historial-productos-importacion',
  templateUrl: './historial-productos-importacion.component.html',
  styleUrls: ['./historial-productos-importacion.component.scss']
})
export class HistorialProductosImportacionComponent implements OnInit {

  listaHistorial:any = [];
  listaHistorialTemp:any = [];
  empresa:any;
  page = 1;
  isDisabled = true;
  pageSize = 10;
  collectionSize:number;

  constructor(
    public productoService: ProductoService
  ) { }

  ngOnInit() {
    this.empresa = localStorage.getItem('usuario');
    this.getHistorial();
  }

  async getHistorial(){

    this.listaHistorial = await this.productoService.getHistorial(this.empresa) || []; 
    this.listaHistorialTemp = this.listaHistorial;
    this.collectionSize = this.listaHistorial.length;
    
  }
  refreshDatos() {
    // this.rows = this.rowsTemp;
    // console.log(this.rows);
     

      this.listaHistorial = this.listaHistorialTemp.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize, 
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    


  }

}

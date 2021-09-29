import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {TranslateService} from '@ngx-translate/core';
import { DescuentoCateService } from 'src/app/service/descuentoCate/descuento-cate.service';

@Component({
  selector: 'app-descuento-lista',
  templateUrl: './descuento-lista.component.html',
  styles: []
})
export class DescuentoListaComponent implements OnInit {
  empresa:any = "";
  addForm: FormGroup;
  descuentos:any;
  rowTemp:any;
  activeRow:any;
  entries: number = 10;
  configuraciones:any;
  textCaract1:any;
  textCaract2:any;
  textCaract3:any;
  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder, 
    public descuentoCateService: DescuentoCateService
  ) { 
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }

  ngOnInit() {

    this.getListaDescuentos();
  }
  getListaDescuentos(){

    Swal.showLoading();
    this.descuentoCateService.getLista(this.empresa).then( (res:any) =>{    
      
      Swal.close();
      this.descuentos = res.response['descuentos'];
      this.rowTemp = res.response['descuentos'];
      this.configuraciones = res.response['configuraciones'];
      this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : "caracteristica 3"
      console.log(res);

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });

  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      const temRow = this.descuentos.filter(function (d) {
      
        for (var key in d) {
          if(!Array.isArray(d[key])){      
            let hola = (d[key] != null) ? d[key].toLowerCase() : '';
            if ( hola.indexOf(val) !== -1) {
              return true;
            }      

          }  
        }
        return false;
      });
      this.descuentos = temRow;
    }else{
      this.descuentos = this.rowTemp;
    }    
  }

} 

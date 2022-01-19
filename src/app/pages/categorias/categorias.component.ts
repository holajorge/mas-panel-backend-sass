import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {TranslateService} from '@ngx-translate/core';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { VendedorService } from 'src/app/service/vendedor/vendedor.service';
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styles: []
})
export class CategoriasComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresa:any = {id:'', pedido:''};
  categorias:any;
  activeRow: any;
  activeRowCliente: any;
  clientes:any;
  categoriasRow:any;
  entries:number = 10;
  entriesCliente:number = 10;
  nombreCarategoria:any;
  clientesCop:any;
  
  constructor(
    private categoriaService: CategoriaService,
    public translate: TranslateService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,

  ) { 
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.getCategoria();
  }

  getCategoria(){
    this.categoriaService.getCategoria(this.empresa).then( (res:any) =>{    
      
      this.categorias = res.response['caracteristica1'];
      this.categoriasRow = res.response['caracteristica1'];
      
    }).catch(err=>{
      console.log(err);
    });

  }
  entriesChange($event){
    this.entries = $event.target.value;
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  filterTableLog(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      let temRow = this.clientes.filter(function (d) {
        for (var key in d) {
          let hola = (d[key] != null) ? d[key].toLowerCase() : '';
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }
        return false;
      });
      this.clientes = temRow;
    }else{
      this.clientes = this.categoriasRow;
    }  
  }
  onSelectItem(modalEdit,row) {
    Swal.showLoading();
    // console.log(row);
    let data = {
      categoria: row.nombre,
      empresa: this.empresa.id
    }
    this.nombreCarategoria = row.nombre;
    this.notificationModal = this.modalService.show(modalEdit,this.notification);
    this.categoriaService.getClienteRestringidos(data).then( (res:any) =>{    
      Swal.close();
      this.clientes = res.response['clientes'];
      this.clientesCop = res.response['clientes'];
     
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  desactivar(row){

    let datos = {
      empresa_id: this.empresa.id,
      categoria:this.nombreCarategoria,
      nrocliente: row.nrocliente
    };
    Swal.fire({
      title: 'Seguro de Desactivar?',
      text: "Se restringira el acceso al cliente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Desactivar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          Swal.showLoading();  
          this.categoriaService.desactivar(datos).then( (res:any) =>{    
            
            if(res.response){
              Swal.fire('Listo!','Desactivar correctamente, con éxito!', 'success')
              this.notificationModal.hide();
              this.getCategoria();
            }else{
              Swal.fire('Error, intente nuevamente', 'error')
            }

          }).catch(err=>{

            Swal.fire('Error, intente nuevamente', 'error')
            console.log(err);
          });
          
        }
      })

  }

  activar(row){
    let datos = {
      empresa_id: this.empresa.id,
      categoria:this.nombreCarategoria,
      nrocliente: row.nrocliente
    };
    Swal.fire({
      title: 'Seguro de Activar?',
      text: "Se podra ver la categoria restringida!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Activar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {  
          Swal.showLoading();  
          this.categoriaService.activar(datos).then( (res:any) =>{    

            if(res.response){
              Swal.fire('Listo!','Activado correctamente, con éxito!', 'success') 
              this.notificationModal.hide();

            }else{
              Swal.fire('Error, intente nuevamente', 'error')
            }              
          
          }).catch(err=>{
            Swal.fire('Error, intente nuevamente', 'error')
            console.log(err);
          });
        }
      })
  }
  onActivateCliente(event){
    this.activeRowCliente = event.row;
  }
  entriesChangeCliente($event){

    this.entriesCliente = $event.target.value;

  }
  filterTableCliente(event){

    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      let temRow = this.clientes.filter(function (d) {
        for (var key in d) {
          let hola = (d[key] != null) ? d[key].toLowerCase() : '';
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }
        return false;
      });
      this.clientes = temRow;
    }else{
      this.clientes = this.clientesCop;
    }  

  }
  
  
}

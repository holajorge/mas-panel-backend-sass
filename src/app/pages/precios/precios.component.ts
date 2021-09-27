import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validate } from 'json-schema';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { PreciosService } from 'src/app/service/precios/precios.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss'],
  // styles: []
})
export class PreciosComponent implements OnInit {
  model: NgbDateStruct;
  notificationModal: BsModalRef;
  empresa:any = {id:""};
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  rows:any = [];
  rowsTemp:any = [];
  activeRow:any;
  entries: number = 10;
  addPrecio:boolean = false;
  editPrecio:boolean = false;
  editForm:any = [];
  
  constructor(
    public translate: TranslateService,
    public preciosService:PreciosService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) 
  { 
    this.empresa.id = localStorage.getItem('usuario');
    this.translate.use('es');
  }

  ngOnInit() {
    this.getPrecios();
    this.editForm = this.formBuilder.group({
      id: [''],
      empresa_id: this.empresa.id,
      nrocliente: ['',Validators.required],
      codigo_producto: ['',Validators.required],
      precio: [''],
      descuento: [''],
    });
  }
  getPrecios(){ 
    this.preciosService.getPrecios(this.empresa).then( (res:any) =>{    
      
        this.rows = res.pedidos['precios'];
        this.rowsTemp = res.pedidos['precios'];
      

    }).catch(err=>{
      console.log(err);
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      const temRow = this.rows.filter(function (d) {
      
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
      this.rows = temRow;
    }else{
      this.rows = this.rowsTemp;
    }    
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  newProduct(addModal){
    this.addPrecio = true;
    this.editPrecio = false;
    this.notificationModal = this.modalService.show(
      addModal,
      this.notification
    );
    this.editForm.patchValue({
      empresa_id: this.empresa.id
    });
  }
  
  insertPrecio(){
    let precio = this.editForm.get('precio').value;
    let descuento = this.editForm.get('descuento').value;
    
    if(precio != "" && descuento != ""){   
      Swal.fire('Elige si el precio especial es un descuento o un precio fijo.','','info');
      this.editForm.patchValue({
        precio: "", descuento: ""
      });
      return false;
    }
    if(precio === "" && descuento === ""){
      Swal.fire('Elige si el precio especial es un descuento o un precio fijo.','','info');
      return false;
    }
   
    this.preciosService.createPrecio(this.editForm.value).then( (res:any) =>{    
      
      if(res.precio){
        this.notificationModal.hide();
        this.editForm.reset();
        this.getPrecios();
        Swal.fire('Listo!','Precio creado, con exito!', 'success')
      }else{
        Swal.fire('Editar Error, intente nuevamente', 'error')
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }
  updatePrecio(){
    this.preciosService.updatePrecio(this.editForm.value).then( (res:any) =>{    
     
      if(res.precio){
        this.notificationModal.hide();
        this.editForm.reset();
        this.getPrecios();
        Swal.fire('Listo!','Precio actualizado, con exito!', 'success')
      }else{
        Swal.fire('Editar Erro, intente novamente', 'error')
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }
  onSelectItem(modalEditPrecios,row) {
    console.log(row);
    this.editForm.patchValue({
      id: row.id,
      empresa_id: row.empresa_id,
      nrocliente: row.nrocliente,
      codigo_producto:row.codigo,
      precio:row.precio,  
      descuento: row.porcentaje
    });
    this.addPrecio = false;
    this.editPrecio = true;
    this.notificationModal = this.modalService.show(modalEditPrecios,this.notification);

  }

  delitePrice(row){

    Swal.fire({
      title: 'Seguro de eliminar?',
      text: "El precio se eliminará definitivamente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          
          this.preciosService.delitePrice(row).then( (res:any) =>{    
     
            if(res.precio){
              // this.notificationModal.hide();
              // this.editForm.reset();
              this.getPrecios();
              Swal.fire('Listo!','Precio eliminado, con exito!', 'success')
            }else{
              Swal.fire('Editar Error, intente nuevamente', 'error')
            }
            
          }).catch(err=>{
            console.log(err);
          });

        }
    })
  }

}

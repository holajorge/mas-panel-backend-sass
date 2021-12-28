import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {TranslateService} from '@ngx-translate/core';
import { DescuentoCateService } from 'src/app/service/descuentoCate/descuento-cate.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-descuento-lista',
  templateUrl: './descuento-lista.component.html',
  styles: []
})
export class DescuentoListaComponent implements OnInit {
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static modal-content-custom", 
  };
  notificationModal: BsModalRef;
  model: NgbDateStruct;

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
  //textCaract4:any;
  
  clientes:any = [];
  caract1:any;
  caract2:any;
  caract3:any;
  //caract4:any;
  flagNewUpdate:boolean = true;
  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder, 
    private modalService: BsModalService,
    public descuentoCateService: DescuentoCateService
  ) { 
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }

  ngOnInit() {

    this.getListaDescuentos();
    
    this.addForm = this.formBuilder.group({
      id: [''],
      empresa_id: [''],
      caract1: [''],
      caract2: [''],
      caract3: [''],
      //caract4: [''],
      cliente: ['',Validators.required],
      descuento: [''],
      empresa: [''],
      codigo_producto: ['']
    });

    this.getDataSelect();

  }

  getListaDescuentos(){

    Swal.showLoading();
    this.descuentoCateService.getLista(this.empresa).then( (res:any) =>{    
      
      Swal.close();
      this.descuentos = res.response['descuentos'];
      this.rowTemp = res.response['descuentos'];
      this.configuraciones = res.response['configuraciones'];
      this.clientes = res.response['clientes'];
      this.clientes.push({nombre:'Todos',nrocliente:0 });

      this.caract1 = res.response['caracteristica1'];
      this.caract2 = res.response['caracteristica2'];
      this.caract3 = res.response['caracteristica3'];
      console.log(this.caract2);
      
      //this.caract4 = res.response['caracteristica4'];

      this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : "caracteristica 3"
      //this.textCaract4 = (this.configuraciones.caracteristica4 != "") ? this.configuraciones.caracteristica4 : "caracteristica 4"

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

  onSelectItem(modal, row){
    this.addForm.reset();
    this.flagNewUpdate = false;
    this.notificationModal = this.modalService.show(modal,this.notification);
    
    this.addForm.patchValue({
      id: row.id,
      empresa_id: row.empresa_id,
      caract1: row.caracteristica1,
      caract2: row.caracteristica2,
      caract3: row.caracteristica3,
      //caract4: row.caracteristica4,
      cliente: row.nrocliente,
      descuento: row.porcentaje,
      empresa: this.empresa,
      codigo_producto: row.codigo_producto
    });

  }
  update(){

    Swal.showLoading();
    this.descuentoCateService.actualizar(this.addForm.value).then( (res:any) =>{    
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Descuento actualizado con exito','success');
        this.addForm.reset();
        this.getListaDescuentos();
        this.notificationModal.hide();
      }else{
        Swal.fire('','error de comuniación, intente de nuevo','error');
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });

  }
  eliminarDecuento(row){

    Swal.fire({
      title: 'Seguro de eliminar?',
      text: "El descuento se eliminará definitivamente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          
          this.descuentoCateService.deleteDescuento(row).then( (res:any) =>{    
     
            if(res.response){
              // this.notificationModal.hide();
              // this.editForm.reset();
              this.getListaDescuentos();
              Swal.fire('Listo!','Descuento eliminado, con exito!', 'success')
            }else{
              Swal.fire('Editar Error, intente nuevamente', 'error')
            }
            
          }).catch(err=>{
            console.log(err);
          });

        }
    })
  }

  newDiscount(modalAddDiscount){
    this.flagNewUpdate = true;
    this.addForm.reset();

    this.notificationModal = this.modalService.show(
      modalAddDiscount,
      this.notification
    );
  }


  getDataSelect(){
    Swal.showLoading();
    this.descuentoCateService.getDataSelect(this.empresa).then( (res:any) =>{

      this.caract1 = res.response['caracteristica1'];
      this.caract2 = res.response['caracteristica2'];
      this.caract3 = res.response['caracteristica3'];
      //this.caract4 = res.response['caracteristica4'];
      this.clientes = res.response['clientes'];

      this.configuraciones = res.response['configuraciones'];
      this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : "caracteristica 3"
      //this.textCaract4 = (this.configuraciones.caracteristica4 != "") ? this.configuraciones.caracteristica4 : "caracteristica 4"

      Swal.close();

      this.clientes.push({nombre:'Todos',nrocliente:0 });

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  registrar(){
    console.log(this.addForm.value);
    this.addForm.patchValue({empresa: this.empresa});
    this.addForm.patchValue({empresa_id: this.empresa});
    Swal.showLoading();
    this.descuentoCateService.registrar(this.addForm.value).then( (res:any) =>{
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Descuento registrado con éxito','success');
        this.addForm.reset();
        this.notificationModal.hide();
        this.getListaDescuentos();

      }else{
        Swal.fire('','error de comuniación, intente de nuevo','error');
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

} 

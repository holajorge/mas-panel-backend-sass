import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
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
  descuentos = [];
  rowTemp:any;
  activeRow:any;
  entries: number = 10;
  configuraciones:any;
  textCaract1:any;
  textCaract2:any;
  textCaract3:any;
  //textCaract4:any;

  clientes:any = [];
  caract1:any = [];
  caract2:any = [];
  caract3:any = [];
  //caract4:any;
  flagNewUpdate:boolean = true;
  flagDisableSelect:boolean = false;
  type = "simple";
  descuentos_volumen = [{"mayor":null, "menor": null, "descuento": null}];
  filtro = {"cliente": null, "todos": null, "caract1": null, "caract2": null, "caract3": null };
  page = 1;
  pageSize = 10;
  descuentosTemp:any = [];
  descuentosTempFilter:any = [];
  collectionSize:number = this.descuentosTempFilter.length;;


  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    public descuentoCateService: DescuentoCateService,
    private route:ActivatedRoute
  ) {
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
    this.route.params.subscribe( params =>{
        this.type = params["type"];
        this.getListaDescuentos();
    })
  }

  ngOnInit() {
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
      codigo_producto: [''],
      todos: [''],
    });

    this.getDataSelect();

  }

  getListaDescuentos(){

    Swal.showLoading();
    this.descuentoCateService.getLista(this.empresa).then( (res:any) =>{

      Swal.close();
      let aux = [];
      if(this.type == "volumen"){
        res.response['descuentos'].forEach((row) => {
            if(row["porcentaje"] == null){
               aux.push(row);
            }
        })
      }
      if(this.type == "simple"){
        res.response['descuentos'].forEach((row) => {
            if(row["porcentaje"] != null){
               aux.push(row);
            }
        })
      }
      this.descuentos = aux;
      this.descuentosTemp = aux;
      this.descuentosTempFilter = aux;
      this.rowTemp = aux;
      this.configuraciones = res.response['configuraciones'];

      let aux_clientes = [];
      res.response['clientes'].forEach((value) => {
        value.name_nrocliente = value.nombre + " (" + value.nrocliente + ")";
        aux_clientes.push(value);
      })

      this.clientes = aux_clientes;
      this.clientes.push({nombre:'Todos',nrocliente:0, name_nrocliente: 'Todos' });

      this.caract1 = res.response['caracteristica1'];
      this.caract2 = res.response['caracteristica2'];
      this.caract3 = res.response['caracteristica3'];

      //this.caract4 = res.response['caracteristica4'];

      this.textCaract1 = (this.configuraciones.caracteristica1 && this.configuraciones.caracteristica1.value && this.configuraciones.caracteristica1.value != "") ? this.configuraciones.caracteristica1.value : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 && this.configuraciones.caracteristica2.value && this.configuraciones.caracteristica2.value != "") ? this.configuraciones.caracteristica2.value : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 && this.configuraciones.caracteristica3.value && this.configuraciones.caracteristica3.value != "") ? this.configuraciones.caracteristica3.value : "caracteristica 3"
      this.refreshDatos();
      //this.textCaract4 = (this.configuraciones.caracteristica4 != "") ? this.configuraciones.caracteristica4 : "caracteristica 4"
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

  onSelectItem(modal, row){
    this.addForm.reset();
    this.descuentos_volumen = [{"mayor":null, "menor": null, "descuento": null}];
    this.flagNewUpdate = false;
    this.notificationModal = this.modalService.show(modal,this.notification);
    if(this.type == "volumen"){
        this.descuentos_volumen = row.rangos;
    }

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
      codigo_producto: row.codigo_producto,
      todos: row.todos
    });

    this.disabledInputCode();

    if(row.codigo_producto != ''){

      this.addForm.controls['caract3'].disable();
      this.addForm.controls['caract2'].disable();
      this.addForm.controls['caract1'].disable();
    }
    if(row.codigo_producto.length  == '' ){

      this.addForm.controls['caract3'].enable();
      this.addForm.controls['caract2'].enable();
      this.addForm.controls['caract1'].enable();
    }

  }
  update(){

    Swal.showLoading();
    this.addForm.value["descuentos_volumen"] = this.descuentos_volumen;
    this.addForm.value["type"] = this.type;
    this.descuentoCateService.actualizar(this.addForm.value).then( (res:any) =>{
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Descuento actualizado con éxito','success');
        this.addForm.reset();
        this.descuentos_volumen = [{"mayor":null, "menor": null, "descuento": null}];
        this.getListaDescuentos();
        this.notificationModal.hide();
      }else{
        Swal.fire('','Error de comuniación, intente de nuevo','error');
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
              Swal.fire('Listo!','Descuento eliminado con éxito!', 'success')
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
    this.descuentos_volumen = [{"mayor":null, "menor": null, "descuento": null}];
    this.notificationModal = this.modalService.show(
      modalAddDiscount,
      this.notification
    );
  }

  disabledInputCode(){

    let select1 = this.addForm.get('caract1').value;
    let select2 = this.addForm.get('caract2').value;
    let select3 = this.addForm.get('caract3').value;

    if(select1 != '' || select2 != '' || select3 != ''){

      this.addForm.controls['codigo_producto'].disable();

    }
    if( (select1 == null || select1 == '') && (select2 == null || select2 == '') &&(select3 == null || select3 == '')){
      console.log('entra');

      this.addForm.controls['codigo_producto'].enable();
    }


  }

  disabledInputSelect(event){
    let text = event.target.value;

    if(text.length > 0 ){

      // this.flagDisableSelect = true;
      this.addForm.controls['caract3'].disable();
      this.addForm.controls['caract2'].disable();
      this.addForm.controls['caract1'].disable();
    }
    if(text.length  == '' ){


      // this.flagDisableSelect = false;

      this.addForm.controls['caract3'].enable();
      this.addForm.controls['caract2'].enable();
      this.addForm.controls['caract1'].enable();
    }

  }

  getDataSelect(){
    Swal.showLoading();
    this.descuentoCateService.getDataSelect(this.empresa).then( (res:any) =>{

      this.caract1 = res.response['caracteristica1'];
      this.caract2 = res.response['caracteristica2'];
      this.caract3 = res.response['caracteristica3'];
      //this.caract4 = res.response['caracteristica4'];

      let aux = [];
      res.response['clientes'].forEach((value) => {
        value.name_nrocliente = value.nombre + " (" + value.nrocliente + ")";
        aux.push(value);
      })

      this.clientes = aux;

      this.configuraciones = res.response['configuraciones'];
      this.textCaract1 = (this.configuraciones.caracteristica1 && this.configuraciones.caracteristica1.value && this.configuraciones.caracteristica1.value != "") ? this.configuraciones.caracteristica1.value : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 && this.configuraciones.caracteristica2.value && this.configuraciones.caracteristica2.value != "") ? this.configuraciones.caracteristica2.value : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 && this.configuraciones.caracteristica3.value && this.configuraciones.caracteristica3.value != "") ? this.configuraciones.caracteristica3.value : "caracteristica 3"
      //this.textCaract4 = (this.configuraciones.caracteristica4 != "") ? this.configuraciones.caracteristica4 : "caracteristica 4"

      Swal.close();

      this.clientes.push({nombre:'Todos',nrocliente:0, name_nrocliente: 'Todos'});

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  registrar(){
    this.addForm.patchValue({empresa: this.empresa});
    this.addForm.patchValue({empresa_id: this.empresa});
    Swal.showLoading();
    this.addForm.value["descuentos_volumen"] = this.descuentos_volumen;
    this.addForm.value["type"] = this.type;
    this.descuentoCateService.registrar(this.addForm.value).then( (res:any) =>{
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Descuento registrado con éxito','success');
        this.addForm.reset();
        this.descuentos_volumen = [{"mayor":null, "menor": null, "descuento": null}];
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

  agregar_otro_dcto_volumen(){
    this.descuentos_volumen.push({"mayor":null, "menor": null, "descuento": null});
  }

  delete_dcto_volumen(element_id){
      let aux = [];
      for(let i=0; i<this.descuentos_volumen.length; i++){
        if(element_id != i){
            aux.push(this.descuentos_volumen[i]);
        }
      }
      this.descuentos_volumen = aux;
  }


  check_valid_button_agregar(){
    let value = false;
    this.descuentos_volumen.forEach((row) => {
        if((row.mayor == 0 || row.mayor == null) && (row.menor == 0 || row.menor == null) && (row.descuento == 0 || row.descuento == null)){
            value = true;
        }
    })
    return value;
  }

  set_todos(){
    if((this.addForm.get('todos').value)){
        this.addForm.patchValue({cliente: 0});
    }
    if(this.filtro.todos){
        this.filtro.cliente = 0;
    }
    this.filterTable();
  }

  refreshDatos() {
      this.collectionSize = this.descuentosTempFilter.length;
      this.descuentos = this.descuentosTempFilter.map(  (product, i) => ({id:i+1,...product})).slice(
                              (this.page - 1) * this.pageSize,
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
  }

  clearFilter(){
    this.filtro = {"cliente": null, "todos": null, "caract1": null, "caract2": null, "caract3": null };
    this.refreshDatos();
  }


  filterTable(){

    const car1 = this.filtro.caract1;
    const car2 = this.filtro.caract2;
    const car3 = this.filtro.caract3;
    let client = this.filtro.cliente
    console.log(client);
    const filtros = {
      cliente: [client, d => d['nrocliente'].toString() == client.toString()],
      caracteristica1: [car1, d => d['caracteristica1'].includes(car1)],
      caracteristica2: [car2, d => d['caracteristica2'].includes(car2)],
      caracteristica3: [car3, d => d['caracteristica3'].includes(car3)],
    }

    let datos = this.descuentosTemp;
    for (const filtro in filtros) {
      if(filtros[filtro][0] == 0 || filtros[filtro][0]){
        datos = datos.filter(filtros[filtro][1]);
      }
    }
    this.descuentosTempFilter = datos;
    this.refreshDatos();

  }

}

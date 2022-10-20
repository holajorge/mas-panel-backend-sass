import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2'
import {TranslateService} from '@ngx-translate/core';
import { DescuentoCateService } from 'src/app/service/descuentoCate/descuento-cate.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PreciosService } from 'src/app/service/precios/precios.service';

@Component({
  selector: 'app-actualizar-precios',
  templateUrl: './actualizar-precios.component.html',
  styleUrls: ['./actualizar-precios.component.scss']
})
export class ActualizarPreciosComponent implements OnInit {
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static modal-content-custom",
  };
  notificationModal: BsModalRef;
  model: NgbDateStruct;

  empresa:any = "";
  addForm: FormGroup;
  descuentos: any;
  configuraciones:any;
  textCaract1:any;
  textCaract2:any;
  textCaract3:any;
  caract1:any = [];
  caract2:any = [];
  caract3:any = [];

  lista_precios:any = [];
  tipo_descuentos:any = [];

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    public descuentoCateService: DescuentoCateService,
    private route:ActivatedRoute,
    private preciosService:PreciosService
  ) {
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
    this.getListaPrecios();
    this.loadTipoDescuento();
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      id: [''],
      empresa_id: [''],
      caract1: [''],
      caract2: [''],
      caract3: [''],
      lista_precios: [''],
      all_listas: [''],
      descuento: ['',Validators.required],
      discount: [''],
      tipo_descuento: ['',Validators.required],
      codigo_producto: ['']
    });

    this.getDataSelect();

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
      this.addForm.controls['caract3'].disable();
      this.addForm.controls['caract2'].disable();
      this.addForm.controls['caract1'].disable();
    }
    if(text.length  == '' ){
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

      this.configuraciones = res.response['configuraciones'];
      this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : "caracteristica 3"
      Swal.close();

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  confirm(){
    let text_marca = "";
    if(this.addForm.get('caract1').value != "" && this.addForm.get('caract1').value != null){
        text_marca = "de la marca " + this.addForm.get('caract1').value + " ";
    }else{
        text_marca = "con el código " + this.addForm.get('codigo_producto').value + " ";
    }

    let text = "Se van a actualizar los productos " + text_marca + this.addForm.get('tipo_descuento').value + " un " + this.addForm.get('descuento').value.toString() + "%."
    let that = this;
    Swal.fire({
      title: 'Confirme los cambios',
      text: text,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'confirmar'
    }).then((result) => {
      if (result.value) {
        that.registrar();
      }
    })
  }

  registrar(){
    this.addForm.patchValue({empresa: this.empresa});
    this.addForm.patchValue({empresa_id: this.empresa});
    let discount = 0;
    if(this.addForm.get('tipo_descuento').value == 'aumentando'){
        discount = 1 + parseFloat(this.addForm.get('descuento').value)/100;
    }else{
        discount = 1 - parseFloat(this.addForm.get('descuento').value)/100;
    }

    this.addForm.patchValue({discount: discount});

    Swal.showLoading();
    this.descuentoCateService.actualizarPrecios(this.addForm.value).then( (res:any) =>{
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Actualización de precios registrado con éxito','success');
        this.addForm.reset();
      //  this.notificationModal.hide();
      }else{
        Swal.fire('','error de comunicación, intente de nuevo','error');
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }


  getListaPrecios(){
    this.preciosService.getListaPrecios({"id": this.empresa}).then( (res:any) =>{
      if(res.success){
        this.lista_precios = res.listaPrecios['excel'];
      }else{

      }
    }).catch(err=>{
      console.log(err);
    });
  }

  loadTipoDescuento(){
    this.tipo_descuentos = [...this.tipo_descuentos, {code: "aumentando", name: "Aumentar"}];
    this.tipo_descuentos = [...this.tipo_descuentos, {code: "disminuyendo", name: "Bajar"}];
  }

  set_all_listas(){
    console.log(this.addForm.get('all_listas').value);
  }

}
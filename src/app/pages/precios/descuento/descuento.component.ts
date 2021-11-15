import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {TranslateService} from '@ngx-translate/core';
import { DescuentoCateService } from 'src/app/service/descuentoCate/descuento-cate.service';

@Component({
  selector: 'app-descuento',
  templateUrl: './descuento.component.html',
  styles: []
})
export class DescuentoComponent implements OnInit {
  empresa:any = "";
  addForm: FormGroup;
  clientes:any = [];;
  caract1:any;
  caract2:any;
  caract3:any;
  textCaract1:string;
  textCaract2:string;
  textCaract3:string;
  configuraciones:any;
  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder, 
    public descuentoCateService: DescuentoCateService
  ) { 
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }
  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa: [''],
      caract1: [''],
      caract2: [''],
      caract3: [''],
      cliente: ['',Validators.required],
      descuento: ['']
    });
    this.getDataSelect();
  }

  getDataSelect(){
    Swal.showLoading();
    this.descuentoCateService.getDataSelect(this.empresa).then( (res:any) =>{    
    
      this.caract1 = res.response['caracteristica1'];
      this.caract2 = res.response['caracteristica2'];
      this.caract3 = res.response['caracteristica3'];
      this.clientes = res.response['clientes'];

      this.configuraciones = res.response['configuraciones'];
      this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : "caracteristica 1"
      this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : "caracteristica 2"
      this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : "caracteristica 3"
      Swal.close();

      this.clientes.push({nombre:'Todos',nrocliente:0 });

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }  

  registrar(){
    this.addForm.patchValue({empresa: this.empresa});
    Swal.showLoading();
    this.descuentoCateService.registrar(this.addForm.value).then( (res:any) =>{    
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Descuento registrado con exito','success');
        this.addForm.reset();
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

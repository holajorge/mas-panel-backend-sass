import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { PreciosService } from 'src/app/service/precios/precios.service';


@Component({
  selector: 'app-actualizar-dolar',
  templateUrl: './actualizar-dolar.component.html',
  styleUrls: ['./actualizar-dolar.component.scss']
})
export class ActualizarDolarComponent implements OnInit {

  precioDolar:any;
  empresa:any = "";
  addForm: FormGroup;

  constructor(public translate: TranslateService,private formBuilder: FormBuilder, private preciosService:PreciosService) {
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
   }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa_id: [''],
      dolar:[''],
    });
  }

  actualizarDolar(){
    this.addForm.patchValue({empresa_id: this.empresa});
    Swal.showLoading();
    this.preciosService.actualizarDolar(this.addForm.value).then( (res:any) =>{
      if(res.response){
        Swal.close();
        Swal.fire('Listo','Actualización de precio del dolar registrado con éxito','success');
        this.addForm.reset();
      }else{
        Swal.fire('','error de comunicación, intente de nuevo','error');
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });

    
  }
}

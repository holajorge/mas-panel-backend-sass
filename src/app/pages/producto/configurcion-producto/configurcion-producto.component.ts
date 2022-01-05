import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ProductoService } from 'src/app/service/producto/producto.service';
import Swal from "sweetalert2";
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-configurcion-producto',
  templateUrl: './configurcion-producto.component.html',
  styleUrls: ['./configurcion-producto.component.scss']
})
export class ConfigurcionProductoComponent implements OnInit {
  addForm: FormGroup;
  empresa: any = {id:''};
  configuraciones:any = [];
  constructor(public translate: TranslateService,public productoService: ProductoService,public configService: ConfigService,
    private modalService: BsModalService,private formBuilder: FormBuilder) {
    
    this.translate.use('es');

    this.addForm = this.formBuilder.group({    
      empresa:  [''],
      caract1: [''],
      caract2: [''],
      caract3: [''],
      caract4: [''],
    });
   }

  ngOnInit() {
    this.getConfiguracion();

  }
  getConfiguracion(){

    this.empresa.id = localStorage.getItem('usuario');

    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
      
      if(res.response.body['configuraciones'] != ""){
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
          
        if(this.configuraciones.caracteristica1 != undefined){
          this.addForm.patchValue({caract1: this.configuraciones.caracteristica1});
        }
        if(this.configuraciones.caracteristica2 != undefined){
          this.addForm.patchValue({caract2: this.configuraciones.caracteristica2});
        }
        if(this.configuraciones.caracteristica3 != undefined){
          this.addForm.patchValue({caract3: this.configuraciones.caracteristica3});
        }
         if(this.configuraciones.caracteristica4 != undefined){
          this.addForm.patchValue({caract4: this.configuraciones.caracteristica4});
        }
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }

  senConfiguracionProduct(){
    Swal.showLoading();
    this.addForm.patchValue({empresa: this.empresa.id })
    this.productoService.updateProductCaract(this.addForm.value).then( (res:any) =>{    
      if(res.productos){
        this.addForm.reset();
        Swal.fire('Listo!','Configuración guardada, con exito!', 'success')
        this.getConfiguracion();
      }else{
        Swal.fire('error al guardar, intente nuevamente', 'error')
      }
      
    }).catch(err=>{
      console.log(err);
      Swal.close();
    });  
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {TranslateService} from '@ngx-translate/core';
import { ProductoService } from 'src/app/service/producto/producto.service';

@Component({
  selector: 'app-importarproducto',
  templateUrl: './importarproducto.component.html',
  styleUrls: ['./importarproducto.component.scss']
})
export class ImportarproductoComponent implements OnInit {
  empresa:any = "";
  addForm: FormGroup;
  file_data:any = [];

  btnvisibilitybtn:boolean = false;
  constructor(public translate: TranslateService,private formBuilder: FormBuilder, public productoService:ProductoService) { 

    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa_id: this.empresa,
      file: [''],
      filesource: ['',Validators.required]
      
    });
  }
  handleFile(event) {

    const files:FileList = event.target.files;
    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id',this.addForm.get('empresa_id').value);
        this.file_data=formData;
        this.addForm.patchValue({filesource: files});
      }else{
        Swal.fire('Error al importar al archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }
    
  }
  sendfile(){
    Swal.showLoading()

    this.productoService.importProducto(this.file_data).then( (res:any) =>{    
      if(res.response == true){
        Swal.close()
        Swal.fire('Listo!','Archivo de Producto importado con exito!', 'success')
      }else{
        Swal.close()
        Swal.fire('Error al importar los datos de los Producto, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close()
      console.log(err);
    });
    

  }
}

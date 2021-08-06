import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import {TranslateService} from '@ngx-translate/core';

import { VendedorService } from 'src/app/service/vendedor/vendedor.service';

@Component({
  selector: 'app-importar-vendedor',
  templateUrl: './importar-vendedor.component.html',
  styles: []
})
export class ImportarVendedorComponent implements OnInit {
  empresa:any = "";
  file_data:any = [];
  addForm: FormGroup;

  constructor(public translate: TranslateService,private formBuilder: FormBuilder, private vendedorService:VendedorService) { 
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
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
        Swal.fire('Erro al importar o arquivo excede o limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }
    
  }
  sendfile(){

    this.vendedorService.importVendedor(this.file_data).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Archivo de vededores importado con exito!', 'success')
      }else{
        Swal.fire('Erro al importar los datos de los vededores, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
    

  }
}

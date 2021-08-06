import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { validate } from 'json-schema';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})
export class ImportarComponent implements OnInit {

  empresa:any = "";
  addForm: FormGroup;
  btnvisibilitybtn:boolean = false;
  file_data:any = [];
  constructor( public translate: TranslateService,private formBuilder: FormBuilder, public clienteService:ClienteService) {
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
  sendfile(){

    // const formData = new FormData();

    // formData.append('file', this.addForm.get('filesource').value);
    // formData.append('empresa_id', this.addForm.get('empresa_id').value);

    this.clienteService.importClient(this.file_data).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Archivo de produtos importado con exito!', 'success')
      }else{
        Swal.fire('Erro al importar los datos de los produtos, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
    

  }

  handleFile(event) {

    const files:FileList = event.target.files;
    console.log(files);
    if(files.length > 0){

      const file = files[0];
      if((file.size/1048576)<=4){
        console.log("hola");
        let formData = new FormData();
        let info={id:2,name:'raja'}
        console.log(this.addForm.get('empresa_id').value);
        formData.append('file', file, file.name);
        formData.append('id',this.addForm.get('empresa_id').value);
        
        this.file_data=formData;
        this.addForm.patchValue({filesource: files});
      }else{
        Swal.fire('Erro al importar o arquivo excede o limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }
    
  }

}

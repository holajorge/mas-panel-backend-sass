import { Component, OnInit } from '@angular/core';
import { WalkthroughService } from 'src/app/service/walkthrough/walkthrough.service';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { ConfigService } from 'src/app/service/config/config.service';


@Component({
  selector: 'app-importar-sucursales',
  templateUrl: './importar-sucursales.component.html',
  styles: []
})
export class ImportarSucursalesComponent implements OnInit {
  empresa:any = "";
  addForm: FormGroup;
  file_data:any = [];

  constructor(
    public translate: TranslateService,private formBuilder: FormBuilder, public clienteService:ClienteService,
    public onboardingService:WalkthroughService) {
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
    console.log(files);
    if(files.length > 0){

      const file = files[0];
      if((file.size/1048576)<=4){
        console.log("hola");
        let formData = new FormData();
        let info={id:2,name:'raja'}
        console.log(this.addForm.get('empresa_id').value);
        formData.append('file', file, file.name);
        formData.append('id',this.empresa);
        
        this.file_data=formData;
        this.addForm.patchValue({filesource: files});
      }else{
        Swal.fire('Error al importar el archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }
    
  }
  sendfile(){
    Swal.showLoading()

    this.clienteService.importarSucursales(this.file_data).then( (res:any) =>{    
      console.log(res.response);
      if(res.response.flag){
        Swal.fire('Listo!','Datos registrados con existo', 'success');
        this.addForm.reset();
      }else{
        Swal.fire('Error revice sus datos si estan correctos, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      console.log(err);
    });
  }
  dataExcelSucursales(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_sucursales?empresa="+this.empresa,"_blank");
  }
  modeloProducto(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_sucursales?modelo=1&empresa="+this.empresa,"_blank");
  }
}

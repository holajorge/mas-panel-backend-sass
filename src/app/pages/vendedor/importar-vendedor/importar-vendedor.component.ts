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
  empresaa:any = {id:''}; 

  file_data:any = [];
  addForm: FormGroup;
  modeloExcel: any = [
    {
      nro_vendedor: '',
      nombre: '',
      apellido: '',
      email: ''
    }
  ];
  dataExcel: any = [];
  constructor(public translate: TranslateService,private formBuilder: FormBuilder, private vendedorService:VendedorService) { 
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
    this.empresaa.id = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa_id: this.empresa,
      file: [''],
      filesource: ['',Validators.required]
      
    });
    this.getDataVendedorExcel();
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
        Swal.fire('Erro al importar al archivo excede el limite de tamanho permitido, intente de nuevo!', 'error')
      }
    }
    
  }
  sendfile(){
    Swal.showLoading()

    this.vendedorService.importVendedor(this.file_data).then( (res:any) =>{    
      if(res.response == true){
        Swal.close()
        Swal.fire('Listo!','Archivo de vededores importado con exito!', 'success')
      }else{
        Swal.close()
        Swal.fire('Error al importar los datos de los vededores, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close()
      console.log(err);
    });
  }
  getDataVendedorExcel(){
    this.vendedorService.getVendedoresData(this.empresaa).then( (res:any) =>{
      this.dataExcel = res.vendedores;
    }).catch(err=>{
      console.log(err);
    });
  }
  modeloVendedor(){

    this.vendedorService.exportAsExcelFile(this.modeloExcel, 'modelo_vendedores');

  }
  dataExcelVendedores(){
    this.vendedorService.exportAsExcelFile(this.dataExcel, 'vendedores');
  }
}

import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validate } from 'json-schema';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { ConfigService } from 'src/app/service/config/config.service';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';
import { VendedorService } from 'src/app/service/vendedor/vendedor.service';

@Component({
  selector: 'app-importar-categoria',
  templateUrl: './importar-categoria.component.html',
  styleUrls: ['./importar-categoria.component.scss']
})
export class ImportarCategoriaComponent implements OnInit {
  empresaa:any = {id:'', pedido:''};
  addForm: FormGroup;
  file_data:any = [];
  empresa:any = "";  
  modeloExcel: any = [
    {
      'caracteristica1': '',
      'nrocliente':'',
      'si/no': ''
    }
  ];
  dataExcel: any = [];
  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder, 
    private categoriaService: CategoriaService,
    private vendedorService:VendedorService

  ) 
  { 
    this.translate.use('es');
    this.empresaa.id = localStorage.getItem('usuario');

  }

  ngOnInit() {

    this.addForm = this.formBuilder.group({
      empresa_id: this.empresaa.id,
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
        
        let formData = new FormData();
        
        console.log(this.addForm.get('empresa_id').value);
        formData.append('file', file, file.name);
        formData.append('id',this.addForm.get('empresa_id').value);
        
        this.file_data=formData;
        this.addForm.patchValue({filesource: files});
      }else{
        Swal.fire('Error al importar el archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }
    
  }

  sendfile(){
    
    Swal.showLoading()
    this.categoriaService.importCategoria(this.file_data).then( (res:any) =>{    
      console.log(res.response);
      if(res.response){
        Swal.close();
        Swal.fire('Listo!','lista importada con exito con exito!', 'success')
       
      }else{
        Swal.close()
        Swal.fire('Error al importar los datos de los clientes, intente de nuevo!', 'error')
      }

    }).catch(err=>{
      Swal.close();
      Swal.fire('Error al importar los datos de los clientes, intente de nuevo!', 'error')

      console.log(err);
    });
    
  }
  modeloCategoria(){
    this.vendedorService.exportAsExcelFile(this.modeloExcel, 'modelo_categorias');
  }
  dataExcelCategoria(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadCategorias?empresa="+this.empresaa.id, "_blank");
  }

}

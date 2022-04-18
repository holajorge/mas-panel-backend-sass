import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreciosService } from 'src/app/service/precios/precios.service';
import { ConfigService } from 'src/app/service/config/config.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router'; //para redireccionar las vistas

@Component({
  selector: 'app-stock-precio',
  templateUrl: './stock-precio.component.html',
  styleUrls: ['./stock-precio.component.scss']
})
export class StockPrecioComponent implements OnInit {

  empresa:any = '';
  addForm: FormGroup;
  file_data:any = [];

  constructor(   
    public translate: TranslateService,
    private formBuilder: FormBuilder, 
    public preciosService:PreciosService,
    private router: Router, 
  ){ 
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }
  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa_id: this.empresa,
      file: [''],
      filesource: ['',Validators.required]
    })
  }
  handleFile(event) {

    const files:FileList = event.target.files;
    if(files.length > 0){

      const file = files[0];
      if((file.size/1048576)<=4){
        
        let formData = new FormData();
        
        //console.log(this.addForm.get('empresa_id').value);
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

    this.preciosService.importarStockPrecio(this.file_data).then( (res:any) =>{    
      if(res.response.flag){
        Swal.fire('Listo!','Datos registrados con éxito', 'success');
        Swal.close();
        this.addForm.reset();
        this.router.navigate(['/admin/producto/productos']);
      }else{
        Swal.fire('Error revise sus datos si estan correctos, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      console.log(err);
    });
  }
  modeloStockPrecio(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_stock_precio?modelo=1&empresa="+this.empresa,"_blank");

  }
  dataExcelStockPrecio(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_stock_precio?empresa="+this.empresa,"_blank");
    
  }
  
}

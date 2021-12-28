import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validate } from 'json-schema';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { PreciosService } from 'src/app/service/precios/precios.service';
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-importar-precios',
  templateUrl: './importar-precios.component.html',
  styles: []
})
export class ImportarPreciosComponent implements OnInit {
  empresaa:any = {id:'', pedido:''};
  addForm: FormGroup;
  file_data:any = [];
  empresa:any = "";
  modeloExcel: any = [{
      nrocliente: '',
      codigo: '',
      precio: '',
      porcentaje_descuento: '',
      caracteristica1: '',
      caracteristica2: '',
      caracteristica3: '',
  }];
  dataExcel: any = [];

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder, 
    public preciosService:PreciosService
  ) {
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
    this.getPrecios();
  }
  getPrecios(){ 
    this.preciosService.getPrecios(this.empresaa).then( (res:any) =>{    
      this.dataExcel = res.pedidos['excel'];
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
    this.preciosService.importPrecios(this.file_data).then( (res:any) =>{    
      console.log(res.response);
      if(res.success == true){
        Swal.close();
        Swal.fire({
          // icon: "info",
          title: "Cantidad de Precios afectado",
          // text: "Cantidad productos eliminados: "+ 40 +"<br>" + "productos Nuevos:" + 50, 
          html: 'cantidad Precios eliminados: '+ '<b>' + res.response.antes[0].cantidad +'</b><br>'+
            'Precios Nuevos:' + '<b>' + res.response.nuevos +'</b>',         
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Deshacer!'
        }).then((result) => {

          let resul = result;
          if (resul.value) {
            this.deshacerCambios();
          }
          if (resul.dismiss){
            this.aplayChange();
          }
          
        });        
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
  deshacerCambios(){
    this.preciosService.deshacerCambiosClientes(this.empresa).then( (res:any) =>{    
      if(res.flag == true){
        Swal.fire('Listo!','Se descartaron los cambios', 'success')
        // this.getPrecios();

      }else{
        Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close()
      Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      console.log(err);
    });
  }
  aplayChange(){
    this.preciosService.aplaychangeClientes(this.empresa).then( (res:any) =>{    
      if(res.flag == true){
        // Swal.fire('Listo!','se deshiso los cambios aplicados!', 'success')
        // this.getClientes();

      }else{
        Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close()
      Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      console.log(err);
    });
  }
  modelocliente(){
    this.preciosService.exportAsExcelFile(this.modeloExcel, 'modelo_precios');
  }
  dataExcelClientes(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_precios?empresa="+this.empresaa.id,"_blank");
    // this.preciosService.exportAsExcelFile(this.dataExcel, 'precios');
  }
}

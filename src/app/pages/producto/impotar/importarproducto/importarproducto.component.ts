import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
import {TranslateService} from '@ngx-translate/core';
import { ConfigService } from 'src/app/service/config/config.service';
import { ProductoService } from 'src/app/service/producto/producto.service';
import Swal from "sweetalert2";
import { WalkthroughService } from '../../../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-importarproducto',
  templateUrl: './importarproducto.component.html',
  styleUrls: ['./importarproducto.component.scss']
})
export class ImportarproductoComponent implements OnInit {
  empresa:any = "";
  addForm: FormGroup;
  file_data:any = [];
  keyname:any = "";

  btnvisibilitybtn:boolean = false;
  dataExcel: any = [];
  modeloExcel: any = [ {
      descripcion: '',
      codigo: '',
      precio: '',
      stock:'',
      caract_1: '',
      caract_2: '',
      caract_3: '',
      precio_oferta: '',
      cantidad_minima: '',
      destacado: '',
      activo: '',
      stock_minimo: '',
      descripcion_1: '',
      caract_4: '',
      foto: '',
      unidad_bulto: ''

    }
  ];
  constructor(public translate: TranslateService,private formBuilder: FormBuilder, private router: Router,
    public productoService:ProductoService,  public onboardingService:WalkthroughService) {

    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa_id: this.empresa,
      file: [''],
      filesource: ['',Validators.required]
      
    });
    this.getProductos();
  }
  getProductos(){ 
    this.productoService.getProducto(this.empresa).then( (res:any) =>{    
      if(res.success){
        this.dataExcel = res.productos['excel'];
      }else{

      }
    }).catch(err=>{
      console.log(err);
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
      
      if(!res.success){
        Swal.fire('error',res.response, 'error');
      }else if(res.success){
        Swal.close();
        this.keyname = res.response.keyname;
        Swal.fire({
          title: "Cantidad de producto afectados",
          html: 'Productos eliminados: '+ '<b>' + res.response.antes[0].cantidad +'</b><br>'+
            'Productos insertados: ' + '<b>' + res.response.nuevos +'</b>',         
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Deshacer'
        }).then((result) => {
         
          let resul = result;
          if (resul.value) {
            this.aplayChange();

          }
          if (resul.dismiss){
            
            this.deshacerCambios();

          }

        });        
      }else{
        Swal.close();
        Swal.fire('Error al importar los datos de los productos, intente de nuevo!', 'error');
      }

    }).catch(err=>{
      Swal.close()
      console.log(err);
    });
  }

  deshacerCambios(){
    this.productoService.deshacerCambiosProductos(this.empresa, this.keyname).then( (res:any) =>{
      if(res.flag == true){
        Swal.fire('Listo!','Se descataron los cambios!', 'success')
        this.getProductos();

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
    this.productoService.aplaychangeProducts(this.empresa, this.keyname).then( (res:any) =>{
      if(res.flag == true){
       Swal.fire('Listo!','Se ejectuaron los cambios!', 'success')
        this.getProductos();
        this.router.navigate(['/admin/producto/productos']);

      }else{
        Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close()
      Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      console.log(err);
    });
  }

  modeloProducto(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_products?modelo=1&empresa="+this.empresa,"_blank");

  }
  dataExcelProductos(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_products?empresa="+this.empresa,"_blank");

    // this.dataExcel = [];
    // if(this.dataExcel.length > 0){
    //   this.productoService.exportAsExcelFile(this.dataExcel, 'productos');
    // }else{
    //   Swal.fire('No hay productos para exportar, intente de nuevo!', 'error')

    // }

  }
}

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
  empresaa:any = {id:'', pedido:''};

  addForm: FormGroup;
  btnvisibilitybtn:boolean = false;
  file_data:any = [];
  modeloExcel: any = [
    {
      nrocliente: '',
      nombre: '',
      email: '',
      descuento: '',
      clave:'',
      cuit: '',
      telefono: '',
      provincia: '',
      localidad: '',
      direccion: '',
      activo: '',
      vendedor: ''
    }
  ];
  dataExcel: any = [];
  constructor( public translate: TranslateService,private formBuilder: FormBuilder, public clienteService:ClienteService) {
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
    this.getClientes();
  }

  getClientes(){ 
    this.clienteService.getcliente(this.empresaa).then( (res:any) =>{    
      this.dataExcel = res.pedidos['excel'];
    }).catch(err=>{
      console.log(err);
    });
  }
  sendfile(){
    Swal.showLoading()
    this.clienteService.importClient(this.file_data).then( (res:any) =>{    
      if(res.response == true){
      Swal.close();

        Swal.fire('Listo!','Archivo de produtos importado con exito!', 'success')
      }else{
        Swal.close();
        Swal.fire('Error al importar los datos de los productos, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close();
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
        Swal.fire('Error al importar el archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }
    
  }
  modelocliente(){
    this.clienteService.exportAsExcelFile(this.modeloExcel, 'modelo_cliente');
  }
  dataExcelClientes(){


    this.clienteService.exportAsExcelFile(this.dataExcel, 'clientes');
  }
}

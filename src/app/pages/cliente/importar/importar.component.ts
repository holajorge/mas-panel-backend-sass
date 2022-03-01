import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { validate } from 'json-schema';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { ConfigService } from 'src/app/service/config/config.service';
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
      console.log(res.response);
      if(res.success == true){
        Swal.close();
        Swal.fire({
          // icon: "info",
          title: "Cantidad de Cliente afectado",
          // text: "Cantidad productos eliminados: "+ 40 +"<br>" + "productos Nuevos:" + 50, 
          html: 'cantidad Cliente eliminados: '+ '<b>' + res.response.antes[0].cantidad +'</b><br>'+
            'productos Nuevos:' + '<b>' + res.response.nuevos +'</b>',         
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Deshacer'
        }).then((result) => {

          let resul = result;
          if (resul.value) {
           // console.log("APLICAR");
             this.aplayChange();
          }
          if (resul.dismiss){
           
         // console.log("DESHACER");
            this.deshacerCambios();
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
    this.clienteService.deshacerCambiosClientes(this.empresa).then( (res:any) =>{    
      if(res.flag == true){
        Swal.fire('Listo!','Se descartaron los cambios', 'success')
        this.getClientes();

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
    this.clienteService.aplaychangeClientes(this.empresa).then( (res:any) =>{    
      if(res.flag == true){
         Swal.fire('Listo!','se ejecutaron los cambios!', 'success')
        this.getClientes();

      }else{
        Swal.fire('Error de comunicación, intente de nuevo!', 'error')
      }
    }).catch(err=>{
      Swal.close()
      Swal.fire('Error de comunicación, intente de nuevo!', 'error')
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
        formData.append('id',this.empresa);
        
        this.file_data=formData;
        this.addForm.patchValue({filesource: files});
      }else{
        Swal.fire('Error al importar el archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }
    
  }
  modelocliente(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_clients?modelo=1&empresa="+this.empresaa.id, "_blank");
  }
  dataExcelClientes(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_clients?empresa="+this.empresaa.id, "_blank");

    // this.clienteService.exportAsExcelFile(this.dataExcel, 'clientes');
  }
}

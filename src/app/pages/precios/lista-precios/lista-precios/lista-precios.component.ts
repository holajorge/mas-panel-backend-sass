import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
import {TranslateService} from '@ngx-translate/core';
import { ConfigService } from 'src/app/service/config/config.service';
import { PreciosService } from 'src/app/service/precios/precios.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-lista-precios',
  templateUrl: './lista-precios.component.html',
  styleUrls: ['./lista-precios.component.scss']
})
export class ListaPreciosComponent implements OnInit {
  empresa:any = "";
  addForm: FormGroup;
  file_data:any = [];

  btnvisibilitybtn:boolean = false;
  dataExcel: any = [];
  modeloExcel: any = [ {
      'LISTA DE PRECIO': '',
      'CODIGO PRODUCTO': '',
      'PRECIO': '',
      'PRECIO OFERTA': ''
    }
  ];
  constructor(public translate: TranslateService,private formBuilder: FormBuilder, public preciosService:PreciosService) {

    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      empresa_id: this.empresa,
      file: [''],
      filesource: ['',Validators.required]

    });
    this.getListaPrecios();
  }
  getListaPrecios(){
    this.preciosService.getListaPrecios({"id": this.empresa}).then( (res:any) =>{
      if(res.success){
        this.dataExcel = res.listaPrecios['excel'];
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

    this.preciosService.importListaPrecios(this.file_data).then( (res:any) =>{
      if(res.success == true){
        Swal.close();
        Swal.fire({
          // icon: "info",
          title: "Cantidad de precios afectados",
          html: 'Precios eliminados: '+ '<b>' + res.response.antes[0].cantidad +'</b><br>'+
            'Precios Nuevos:' + '<b>' + res.response.nuevos +'</b>',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Deshacer'
        }).then((result) => {

          let resul = result;
          if (!(resul.dismiss)){
          }

        });
      }else{
        Swal.close()
        Swal.fire('Error al importar los datos de los productos, intente de nuevo!', 'error')
      }

    }).catch(err=>{
      Swal.close()
      console.log(err);
    });
  }

  modeloListaPrecios(){
    this.preciosService.exportAsExcelFile(this.modeloExcel, 'modelo_lista_precios');

  }
  dataExcelProductos(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/download_lista_precios?empresa="+this.empresa,"_blank");

  }
}
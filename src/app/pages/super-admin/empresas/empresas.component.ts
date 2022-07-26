import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmpresaService } from 'src/app/service/empresa/empresa.service';
import Swal from 'sweetalert2';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; //para redireccionar las vistas
import { RegistracionService } from 'src/app/service/registracion/registracion.service';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  empresas:any = [];
  tempEmpresa:any = [];
  nombreEmpresa:string = '';
  empresa:string = '';
  empresaDetails:[] = [];
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  disableButton = true;
  flag:boolean = false;
  errorForm = false;
  fieldTextType: boolean;
    
  constructor(private registracionService:RegistracionService,
    private router: Router,public empresaService:EmpresaService,private modalService: BsModalService,public translate: TranslateService) {
    this.translate.use('es');

     }

  ngOnInit() {
    // if(localStorage.getItem('afiliado')){
      this.getEmpresasAfiliado();
    // }else{
      // this.getEmpresas();
    // }
  }
  getEmpresas(){
    Swal.showLoading();
    this.empresaService.getEmpresas().subscribe(
      (datos) => {
        Swal.close();
        console.log(datos);
        this.empresas = datos;
        this.tempEmpresa = datos;
        console.log(this.empresas);
        
      },
      (error) => {
        Swal.close();
        console.log(error);
      }
      
    )
  }
  
  getEmpresasAfiliado(){
    Swal.showLoading();
    this.empresaService.getEmpresasAfiliado().subscribe(
      (datos) => {
        Swal.close();
        console.log(datos);
        this.empresas = datos;
        this.tempEmpresa = datos;
        console.log(this.empresas);
        
      },
      (error) => {
        Swal.close();
        console.log(error);
      }
      
    )
  }
  newCompany(addModal){
    this.flag = false;
    this.disableButton = true;

    this.notificationModal = this.modalService.show(
      addModal,
      this.notification
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  registracion(form:NgForm){
    console.log(form);
    if(localStorage.getItem('afiliado')){
      form.value.token = localStorage.getItem('admin');
    }
    if(this.errorForm){
        Swal.fire({
          title: "Hubo un error",
          text: "Revise los datos e intente nuevamente",
          type: "error",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        });
        return;
    }
    this.disableButton = true;
    
    Swal.showLoading();

    this.registracionService.save(form.value).subscribe(
        (data:any) => {
          let respuesta = JSON.parse(data.body);

          if(!respuesta.error){
            Swal.fire({
              title: "Exito",
              text: "Registro creado correctamente",
              type: "success",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-primary"
            });

            this.notificationModal.hide();
            if(localStorage.getItem('afiliado')){
              this.getEmpresasAfiliado();
            }else{
              this.getEmpresas();
            }
          }else{
            Swal.fire({
              title: "Error",
              text: "Registro no fue creado correctamente",
              type: "error",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-error"
            });
          }


          
          // var data_login = {"usuario": form.value["email"], "password": form.value["password"]}

        },        
        (error) => {
            Swal.fire({
              title: "Hubo un error",
              text: "Revise los datos e intente nuevamente",
              type: "error",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-error"
            });
        }
      );
    
  }

  validatePageField(pagina){
    if(pagina == ""){
        this.errorForm = false;
        return false;
    }
    var aux = /^[a-zA-Z]+$/.test(pagina);
    if(aux){
        this.errorForm = false;
        return false;
    }else{
        this.errorForm = true;
        return true;
    }
  }
  aceptTerminos(){
    
    if(this.flag){      
      this.disableButton = false;
    }else{
      this.disableButton = true;

    }
  }
  esMayuscula(letra){
      return letra === letra.toUpperCase();
  }
  comprobarTexto(itemBusqueda, textoInput ){

    if(this.esMayuscula(textoInput)){
      textoInput = textoInput.toUpperCase();
      itemBusqueda = itemBusqueda.toUpperCase();
      
    }else{
      textoInput = textoInput.toLowerCase()
      itemBusqueda = itemBusqueda.toLowerCase();
      
    }
    if(itemBusqueda.includes(textoInput)){
      return true;
    }else{
      return false;
    }

  }
  filters(){

    const nombre = this.nombreEmpresa;
    
    const filtros = {
      
      nombre: [nombre, d => {
        if(this.comprobarTexto(d['nombre'],nombre)){
          return true;
        }
      }],
    }
    let producto1 = this.tempEmpresa;
    for (const filtro in filtros) {
      if(filtros[filtro][0]){
        producto1 = producto1.filter( filtros[filtro][1])
      }
    }
    this.empresas = producto1;
  }
  eliminar(){
    
    this.nombreEmpresa = '';
    this.empresas = this.tempEmpresa;
  }

  openInfo(modalEmpresa,empresa){
    console.log(empresa);
    this.empresa = empresa.nombre;
    this.empresaDetails = empresa;
    this.notificationModal = this.modalService.show(
      modalEmpresa,
      this.notification
    );
  }
  viewAdminPanel(empresa){
    Swal.showLoading(); 
    this.empresaService.getTokenEmpresa(empresa).subscribe(
      (datos) => {
        Swal.close();
        console.log(datos);
        localStorage.setItem('usuario', datos);
        window.location.href = "";
        // this.router.navigate(['/admin']);
      },
      (error) => {
        Swal.close();
        console.log(error);
      }
      
    )
  }
}

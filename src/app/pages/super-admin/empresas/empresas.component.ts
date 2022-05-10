import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmpresaService } from 'src/app/service/empresa/empresa.service';
import Swal from 'sweetalert2';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; //para redireccionar las vistas

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
    
    constructor(private router: Router,
      public empresaService:EmpresaService,private modalService: BsModalService) { }

  ngOnInit() {
    this.getEmpresas();
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
  newCompany(){
    
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

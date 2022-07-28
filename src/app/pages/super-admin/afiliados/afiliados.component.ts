import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmpresaService } from 'src/app/service/empresa/empresa.service';
import Swal from 'sweetalert2';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; //para redireccionar las vistas

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.scss']
})
export class AfiliadosComponent implements OnInit {
  afiliadosEmpre:[] = [];
  empresas:any = [];
  tempEmpresa:any = [];
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  nameEmpresa:string = '';
  entries:number = 10;
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
      },
      (error) => {
        Swal.close();
        console.log(error);
      }
      
    )
  }
  openInfo(modal, empresa){

    this.nameEmpresa = empresa.nombre;
    this.afiliadosEmpre = [];
    this.empresaService.getAfiliadosEmpresa({'id':empresa.id}).subscribe(
      (empresas) => {

        this.afiliadosEmpre = empresas;
        console.log(this.afiliadosEmpre);
        
      },
      (error) => {
        console.log(error);
      }
    );
   
    this.notificationModal = this.modalService.show(
      modal,
      this.notification
    );




  }
  desactivarAfiliado(empresa){

  }
  editar(empresa){

  }
}

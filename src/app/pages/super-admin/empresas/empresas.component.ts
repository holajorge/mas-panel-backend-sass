import { Component, OnInit } from '@angular/core';
import { EmpresaService } from 'src/app/service/empresa/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  empresas:any = [];
  constructor(public empresaService:EmpresaService) { }

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
}

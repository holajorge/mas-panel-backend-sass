import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresaService } from '../../service/empresa/empresa.service';

@Component({
  selector: 'app-estados-pedidos',
  templateUrl: './estados-pedidos.component.html',
  styleUrls: ['./estados-pedidos.component.scss']
})
export class EstadosPedidosComponent implements OnInit {
  
  formEstado: FormGroup;
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };

  data: any;
  dataTempo:any;

  flagNew:boolean = true;
  empresa:any;
  entries: number = 10;
  
  lista:any = [];
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder, 
    private empresaService: EmpresaService
  ) { }

  ngOnInit() {

    this.empresa = localStorage.getItem('usuario');

    this.formEstado = this.formBuilder.group({
      nombre: ['', Validators.required],
      token: [''] 
    });

    this.getListaEstados();
  }

  async getListaEstados(){

    this.lista = await this.empresaService.getEstados({token:this.empresa}) || [];
  }

  addStatus(modalAdd){

    this.notificationModal = this.modalService.show(modalAdd,this.notification);

  }

  openEditState(modalAdd, row){

    
    this.notificationModal = this.modalService.show(modalAdd,this.notification);

    
  }

  async onCreateEstado(){
    
    this.formEstado.patchValue({token: this.empresa});

    const response = await this.empresaService.newEstados(this.formEstado.value) || false;

    if(response){

      this.notificationModal.hide();
      this.getListaEstados();

    }

    console.log(response);
    

  }

  onUpdateEstado(){
    
  }

  

  filterTable(event){
    console.log(event);
    
  }
}

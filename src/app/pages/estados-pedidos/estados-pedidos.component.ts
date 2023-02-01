import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresaService } from '../../service/empresa/empresa.service';
import Swal from "sweetalert2";

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
    this.flagNew = true;
    this.formEstado.reset();
    this.formEstado.removeControl('estado_id');
    this.notificationModal = this.modalService.show(modalAdd,this.notification);

  }

  openEditState(modalAdd, row){
    this.flagNew = false;
    this.formEstado.patchValue({nombre: row.estado,token: this.empresa});

    this.formEstado.addControl('estado_id', new FormControl(row.estado_id, Validators.required));

    this.notificationModal = this.modalService.show(modalAdd,this.notification);
    
  }

  async onCreateEstado(){
    Swal.showLoading();
    
    this.formEstado.patchValue({token: this.empresa});

    const response = await this.empresaService.newEstados(this.formEstado.value) || false;

    if(response){
      Swal.fire('Listo!','Estado guardado con éxito!', 'success')
      this.notificationModal.hide();
      this.getListaEstados();
    }else{
      Swal.fire('Error', 'Error al guardar el nuevo estado, intente de nuevo','error');
    }
    

  }
  
  async onUpdateEstado(){
    
    Swal.showLoading();

    const response = await this.empresaService.editEstados(this.formEstado.value) || false;

    if(response){
      Swal.fire('Listo!','Estado actualizado con éxito!', 'success')
      this.notificationModal.hide();
      this.getListaEstados();
    }else{
      Swal.fire('Error', 'Error al actualizar el estado, intente de nuevo','error');
    }
  }

  onDeleteState(row){

    Swal.fire({
      title: 'Seguro de Eliminar el estado?',
      text: "Se eliminara de manera permanente!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          
          this.confirmarEliminar(row);
          
        }
      })

  }

  async confirmarEliminar(row){
    Swal.showLoading();  

    const response =  await this.empresaService.deleteEstado({estado_id: row.estado_id}) || false;
    
    if(response['flag']){

      Swal.fire('Listo!','Estado eliminado con éxito!', 'success');
      this.getListaEstados();

    }else{

      if(response['existe']){
        Swal.fire('Error', 'El estado esta relaccionado a un pedido, no es posible eliminarlo','error');

      }else{
      Swal.fire('Error', 'Error inesperado, intente de nuevo','error');

      }

    }


  }
  filterTable(event){
    console.log(event);
    
  }
}

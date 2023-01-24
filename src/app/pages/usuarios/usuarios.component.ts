import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {TranslateService} from '@ngx-translate/core';
import { UsuariosService } from 'src/app/service/usuarios/usuarios.service';
import Swal from "sweetalert2";

import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  flagNew:boolean = false;
  editForm: FormGroup;
  newFormVendedor: FormGroup;
  listaModulos: any = [];
  listaUsuarios: any = [];
  listaFiltros: any = [];
  temp = [];
  tempRow = [];
  pageSize = 10;
  page = 1;
  collectionSize:number = this.tempRow.length;
  flagAdd:boolean = false;
  notificationModal: BsModalRef;
  permiso = null;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresa:any = {id:'', pedido:''};
  dataFilter:any= [];

  constructor(
    private usuarioService: UsuariosService,
    public translate: TranslateService,
    private modalService: BsModalService,
    
    private formBuilder: FormBuilder, public onboardingService:WalkthroughService
  ) {
      this.translate.use('es');
      this.empresa.id = localStorage.getItem('usuario');   
  }


  ngOnInit() {
    let myDict = {};

    this.usuarioService.getModulos().then( (res:any) =>{
      this.listaModulos = res.data.modulos;
      for (let i = 0; i < res.data.modulos.length; i++) {
        myDict[res.data.modulos[i].nombre] = '';
      }
    }).catch(err=>{
      console.log(err);
    });
    myDict = [myDict];
    this.editForm = this.formBuilder.group({
      empresa_id:  this.empresa.id,
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      clave: ['', Validators.required],
      permisos:new FormArray([]),
      
    });
    this.getUsuarios();
  }

  modalForm(modal){
    this.flagNew = true;
    this.editForm.reset();
    
    this.notificationModal = this.modalService.show(
      modal,
      this.notification
    );
    this.flagAdd = true;
  }

  addUsuario(modalEdit){
    this.editForm.get('empresa_id').setValue(this.empresa.id);
    
    Swal.showLoading();
    this.usuarioService.crearUsuario(this.editForm.value).subscribe(data => {  
      if(data == true){
        Swal.fire('','Datos del nuevo usuario creado con éxito!', 'success');
        this.clearData();
        this.notificationModal.hide();
        this.getUsuarios();
       }else{
        Swal.fire('Error, intnente de nuevo', 'error')
       }
    },  
    error => {  
      Swal.fire('Error, intnente de nuevo', 'error')
        console.log(error);  
    });  

  }
  
  //mejor que reste editForm por el campo permisos
  clearData(){
    this.editForm = this.formBuilder.group({
      empresa_id:  this.empresa.id,
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      clave: ['', Validators.required],
      permisos:new FormArray([]),
      
    });
  }
  onCheckChange(event) {
    const formArray: FormArray = this.editForm.get('permisos') as FormArray;
  
    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    }else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  getUsuarios(){
    Swal.showLoading();
    let data = {id:this.empresa};
    this.usuarioService.getUsuarios().then( (res:any) =>{       
        Swal.close();
        this.listaUsuarios = res.data.usuarios;
        this.temp = this.listaUsuarios;
        this.tempRow = this.listaUsuarios;
        this.collectionSize = this.temp.length;
        this.refreshDatos();
      },
      (error) => {
        console.log(error);        
        Swal.fire('Error', 'Error inesperado, intente de nuevo','error');        
      }
    )
  }

  deleteUsuario(email){
    Swal.fire({
      title: 'Confirma que quiere eliminar el Usuario?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Si, eliminar',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {

      setTimeout( () => {

        if (result.value) {
          Swal.showLoading();

          let data = {usuario:email, id:this.empresa};
          
          this.usuarioService.eliminarUsuario(data).subscribe(
            (flag) => {

              if(flag){
                Swal.fire('Listo', 'Usuario eliminado con éxito', 'success');
                this.getUsuarios();
                this.notificationModal.hide();
              }else{
                Swal.fire('error', 'No fue posible eliminar el Usuario, por favor intente de nuevo', 'error');          
              }
            },
            (error)=> {
              console.log(error);        
              Swal.fire('error', 'No fue posible eliminar el Usuario, por favor intente de nuevo', 'error');          
            }
          )
        }
      }, 1000);
    }) 
  }
  
  refreshDatos() {
    if(this.dataFilter.length > 0){
      this.temp = this.dataFilter;
      this.temp = this.temp.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize,
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    }else{

      this.temp = this.tempRow.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize,
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    }
  }

  onSelectItem(modal, usuario){
    this.clearData();
    this.flagAdd = false;
    this.editForm.patchValue({nombre:usuario.nombre});
    this.editForm.patchValue({apellido:usuario.apellido});
    this.editForm.patchValue({email:usuario.email});
    this.editForm.patchValue({clave:usuario.clave});
  
    this.notificationModal = this.modalService.show( modal,this.notification);
    
  }

  actualizarUsuario(){
    let formData = new FormData();
    Swal.showLoading();
    
    formData.append('empresa_id',this.empresa.id);
    formData.append('nombre',this.editForm.get('nombre').value);
    formData.append('apellido',this.editForm.get('apellido').value);
    formData.append('email',this.editForm.get('email').value);
    formData.append('clave',this.editForm.get('clave').value);
    formData.append('permisos',this.editForm.get('permisos').value);

    this.usuarioService.actualizarUsuario(formData).subscribe(
      (flag) => {
        if(flag){
          Swal.fire('Listo', 'Usuario actualizados con exito', 'success');
          this.getUsuarios();
          this.notificationModal.hide();
          
        }else{
          Swal.fire('error', 'No fue posible actualizar el Usuario, porfavor intente de nuevo', 'error');          
        }
      },
      (error)=> {
        console.log(error);        
        Swal.fire('error', 'No fue posible actualizar el Usuario, porfavor intente de nuevo', 'error');          
      }
    )
  }

  filtraPer(){
    const per = this.listaFiltros;
    const filtros = {
      permisos: [per, d => {
        var flag = true;
        var listaU = d['permisos'].split(",");
        this.listaFiltros.forEach(function(element) {
          if(!listaU.includes(element)){
            flag = false;
          }
      });
        return this.listaFiltros.length==0?true:flag;
      }]
    }
    
    let usuarios = this.tempRow;  
    for (const filtro in filtros) {
      if(filtros[filtro][0]){
        usuarios = usuarios.filter( filtros[filtro][1])   
      }
    }       
    
    if(usuarios.length > 0){
      this.dataFilter = usuarios;  
      this.collectionSize = usuarios.length;
      this.refreshDatos();
    }else{
      this.dataFilter = [];  
      this.temp = [];
      this.collectionSize = 0;
    } 

  }

  addFiltro(){
    if(!this.listaFiltros.includes(this.permiso)){
      this.listaFiltros.push(this.permiso);
      this.filtraPer();
    }
  }

  eliminarFiltro(per){
    this.listaFiltros = this.listaFiltros.filter(x => x !== per);
    this.filtraPer();
  }
}

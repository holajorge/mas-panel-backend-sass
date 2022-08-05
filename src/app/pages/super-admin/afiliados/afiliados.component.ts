import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmpresaService } from 'src/app/service/empresa/empresa.service';
import Swal from 'sweetalert2';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; //para redireccionar las vistas
import { FormBuilder,Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
  editForm:any = [];    
  fieldTextType: boolean;
  
  constructor(private router: Router,private formBuilder: FormBuilder, public translate: TranslateService,
    public empresaService:EmpresaService,private modalService: BsModalService) {  this.translate.use('es');}

  ngOnInit() {
    this.getAfiliados();
    this.editForm = this.formBuilder.group({
      id: [''],
      nombre: ['',Validators.required],
      mail: ['',Validators.required],
      clave: [''],
    });
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  getAfiliados(){
    Swal.showLoading();
    this.empresaService.getAfiliados().subscribe(
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
  openInfo(modal, afiliado){

    this.nameEmpresa = afiliado.nombre;
    this.afiliadosEmpre = [];
    this.empresaService.getAfiliadosEmpresa({'id':afiliado.id}).subscribe(
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
  desactivarAfiliado(afiliado){

    Swal.fire({
      title: 'Seguro de Desactivar afiliado?',
      text: "Esta accion desactiva la cuenta, dejandolo sin acceso al sistema!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Desactivar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {

          setTimeout( ()=> {
            Swal.showLoading();
            this.empresaService.dishableAfiliado({id: afiliado.id}).subscribe(
              (flag) => {
                if(flag){
                  Swal.fire('Listo!','El cambio aplicado correctamente','success');
                  this.getAfiliados();
                }else{
                  Swal.fire('error!','El cambio no se aplico, intente nuevamente', 'error');
                }        
              },
              (error) => {
                Swal.close();
                console.log(error);
              }
            );    
          },2000 );
        }
          
    })

  }
  editar(modal,empresa){
    console.log(empresa);
    
    this.editForm.patchValue({
      id: empresa.id,
      nombre: empresa.nombre, 
      mail: empresa.mail,
      // dominio: empresa.dominio,
      clave: '',
    });
    this.notificationModal = this.modalService.show(
      modal,
      this.notification
    );
  }
  saveAfiliado(){
    Swal.showLoading();
    // console.log(this.editForm.value);
    this.empresaService.saveAfiliado(this.editForm.value).subscribe(
      (flag) => {

        if(flag){
          Swal.fire('Listo!','Los registros guardados con exito','success');
          this.notificationModal.hide();
          this.getAfiliados();
        }else{
          Swal.fire('error!','Los Registros no fueron guardados con exito, intente nuevamente', 'error');
        }
        
      },
      (error) => {
        Swal.close();
        console.log(error);
      }
    );    
  }
}

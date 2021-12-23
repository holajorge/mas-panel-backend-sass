import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';//importar para formular envio de todos los parametros
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-micuenta',
  templateUrl: './micuenta.component.html',
  styles: []
})
export class MicuentaComponent implements OnInit {
  addForm: FormGroup;
  newFormVendedor: FormGroup;
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresa:any = {id:''}; 
  empresaData:any;
  // lastpassword:String = "";
  flag:boolean = false;
  confirm:string="";
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder, 
    public translate: TranslateService,
    public configService: ConfigService
  ) { 
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');

    this.addForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmpassword: [null, Validators.required],
      empresa: [null],
      lastpassword: [null]
    });
    this.addForm.controls['password'].disable();
    this.addForm.controls['confirmpassword'].disable();
  }

  ngOnInit() {
    
    this.getConfig();
   
  }
  getConfig(){
    Swal.showLoading();
    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
      console.log(res.response['body']['empresa']);
      this.empresaData = res.response['body']['empresa'];

      this.addForm.patchValue({
        email: this.empresaData.email,
        empresa: this.empresa.id
      })
      Swal.close();
    });
  }
  cambiarCorreo(){
    if(this.validaEmail(this.addForm.get('email').value)){
      let data = { 
        email: this.addForm.get('email').value,
        empresa:this.empresa.id
      }
      this.configService.validarExisteEmail(data).subscribe(
        (res:any)=>{
          if(res){
            Swal.fire('error','correo ya existe, ingrese otro correo para hacer el cambio','error');
          }else{
            Swal.fire('Listo','Correo actualizado con exito','success');
          }
        },
        (error) =>{
          Swal.fire('error','Error inesperado, intente nuevamente','error');
          console.log(error);
        }
      )

    }else{
      Swal.fire('error', 'Ingrese un correo valido','error');
    }

  }
  validaEmail(email){
    return String(email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
  comprobarPassword(){
    
    let empresa = {
      empresa: this.empresa.id,
      last: this.addForm.get('lastpassword').value.trim()
    }

    return this.configService.checkLastPass(empresa).subscribe(
      (res:any)=>{
        if(res){
          this.addForm.controls['password'].enable();
          this.addForm.controls['confirmpassword'].enable();
          return true;
        }else{
          Swal.fire('error', 'La contraseña anterior no es correcta,porfavor ingrese correctamente su contraseña anterior','error');
          return false;
        }        
      }, (error) =>{
        Swal.fire('error', 'Error inesperado,porfavor intente nuevamente','error');
        return false;
        console.log(error);
        
      }
    );
    
  }

  confirmPasswordNew(event:any){

    const confirm = event;
    console.log(confirm);
    if(confirm === this.addForm.get('password').value){
      console.log('si');

      this.addForm.patchValue({
        confirmpassword: confirm
      });
      return true;
    }else{
      console.log('no');
      this.addForm.controls['password'].reset(); 
      this.addForm.controls['confirmpassword'].reset(); 
      Swal.fire('error','contraseñas deben de ser iguales en ambos campos, porfavor intente de nuevo','error');
      this.addForm.patchValue({
        confirmpassword: null 
      });
      return false;

    }
  }
  registrarData(){

    Swal.showLoading();
    if(this.comprobarPassword()){
      console.log('paso');

      let confirm = this.addForm.get('confirmpassword').value;
      if(!confirm){
        Swal.fire('error','Ingrese la nueva contraseña en ambos campos','error');
        return false;
      }

      if( this.confirmPasswordNew(confirm.trim()) ){

        this.configService.saveData(this.addForm.value).then( (res:any) =>{

          console.log(res);
          if(res.response['body'].flag == true){
            Swal.fire('Listo!','configuración guardada con exito!', 'success');
            this.getConfig();
            this.addForm.reset();
          }else{
            Swal.fire('Error al guardar, intente de nuevo!', 'error')
          }
          
          
        }).catch(err=>{
          Swal.close();
          console.log(err);
        });
      }
    }else{
      Swal.close();

    }

  }
  solicitarBaja(){

    Swal.fire({
      title: '¿Seguro de solicitar la baja?',
      text: "Se dará de baja la cuenta!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, estoy seguro!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          Swal.showLoading();

          this.configService.darBaja(this.empresa).then( (res:any) =>{

            console.log(res);
            if(res.response['body'].flag == true){
              Swal.fire('Listo!','Baja solicitada con éxito!', 'success');
              this.getConfig();
              // this.addForm.reset();
            }else{
              Swal.fire('Error al guardar, intente de nuevo!', 'error')
            }
          }).catch(err=>{
            Swal.close();
            console.log(err);
          });
        }
    })

  }
}

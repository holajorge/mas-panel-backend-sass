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
  response:boolean = false;
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
    // this.addForm.controls['password'].disable();
    // this.addForm.controls['confirmpassword'].disable();
  }

  ngOnInit() {
    
    this.getConfig();
   
  }
  getConfig(){
    Swal.showLoading();
    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
 
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
            Swal.fire('error','Correo ya existe, ingrese otro correo para hacer el cambio','error');
          }else{
            Swal.fire('Listo','Correo actualizado con éxito','success');
          }
        },
        (error) =>{
          Swal.fire('error','Error inesperado, intente nuevamente','error');
          console.log(error);
        }
      )

    }else{
      Swal.fire('error', 'Ingrese un correo válido','error');
    }

  }
  validaEmail(email){
    return String(email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
  // comprobarPassword(){
    
  //   let empresa = {
  //     empresa: this.empresa.id,
  //     last: this.addForm.get('lastpassword').value.trim()
  //   }
  //   let hola = false;
  //   this.configService.checkLastPass(empresa).subscribe(
  //     (res:any)=>{
  //       if(res){
  //         return true;
  //       }else{
  //         return false;
  //       }        
  //     }, (error) =>{
  //       // Swal.fire('error', 'Error inesperado,porfavor intente nuevamente','error');
  //       console.log(error);
  //       return false;
        
  //     }
  //   );
    
  // }

  confirmPasswordNew(event:any){

    const confirm = event.target.value;

    if(confirm === this.addForm.get('password').value){
      console.log('si');

      this.addForm.patchValue({confirmpassword: confirm});
      this.addForm.valid;
    }else{
      console.log('no');
      this.addForm.controls['password'].reset(); 
      this.addForm.controls['confirmpassword'].reset(); 
      this.addForm.invalid;

      Swal.fire('error','contraseñas deben de ser iguales en ambos campos, porfavor intente de nuevo','error');
      
    }
  }
  registrarData(){

    Swal.showLoading();
          
    let confirm = this.addForm.get('confirmpassword').value;
    if(!confirm){
      Swal.fire('error','Ingrese la nueva contraseña en ambos campos','error');
      return false;
    }

    this.configService.saveData(this.addForm.value).subscribe( 
      (res:any) => {
        
        switch(res.num){
          case 1: 
            this.addForm.reset();
            this.getConfig();
            
            Swal.fire('Listo!',res.mgs, 'success');
            break;
          case 2:
            Swal.fire('Error',res.mgs, 'error');
            break;
          case 3:
            Swal.fire('Error',res.mgs, 'error');
            break;
          case 4:
            Swal.fire('Error',res.mgs, 'error');
            break;
          default: 
            Swal.fire('Error','Error al guardar, intente de nuevo', 'error');
            break;
        }
        
      },(error)=>{

        Swal.fire('Error','Error al guardar, intente de nuevo', 'error');

        console.log(error);
      }
      // if(res.response['body'].flag == true){
      //   Swal.fire('Listo!','configuración guardada con éxito!', 'success');
      //   this.addForm.reset();
      //   this.getConfig();
      // }else{
      //   Swal.fire('Error al guardar, intente de nuevo!', 'error')
      // }
    );

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

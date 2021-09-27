import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';//importar para formular envio de todos los parametros
import { Router } from '@angular/router'; //para redireccionar las vistas
import { LoginService } from '../../service/login/login.service';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  constructor(private loginService:LoginService, private router: Router, public translate: TranslateService) { 
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  ngOnInit() {
   
  }

  login(form:NgForm){
    // console.log(form.value);
    Swal.showLoading();
    this.loginService.auth(form.value).subscribe((data:any) => {  
      // console.log(data); return false;
      if(data.body.perfil != null){
        
        localStorage.setItem('usuario', data.body.id);
        Swal.close();
        form.reset();
        this.router.navigate(['/admin']);
       }else{
        Swal.close();
        Swal.fire({
          title: "Hubo un error",
          text: "Revise los datos e intente nuevamente",
          type: "error",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        });
       }
    },  
      error => {  
        Swal.close();
        Swal.fire({
          title: "Hubo un error",
          text: "Revise los datos e intente nuevamente",
          type: "error",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        });
        // alert(error);  
    });  
    // if(form.value.usuario === 'admin' && form.value.password === 'hola123'){
    //   localStorage.setItem('usuario', form.value.usuario);
    //   this.router.navigate(['/admin']);
    // }
  }
  passwordRecover(){

    Swal.fire({
      title: "¿Olvidaste la contraseña?",
      text: "A continuación, te enviaremos una contraseña para recuperar el acceso a la cuenta.",
      input: 'text',
      inputPlaceholder: "usuario@correo.com.ar",
      confirmButtonText: 'Recuperar contraseña',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary ml-0 ml-sm-1',
        cancelButton: 'btn btn-outline-light mt-1 mt-sm-0',
        input: 'form-control'
      },
      reverseButtons: true,
      buttonsStyling: false,
      showCancelButton: true,
      showCloseButton: true,
      }).then((result) => {
          if (result.value) {
              // console.log("Result: " + result.value);

            this.loginService.sendemailresetpassword(result.value).subscribe(
              (data:any) => {
                console.log(data);
                if(data.body == true){
                  Swal.fire('Listo!','correo enviado!', 'success')
                }
              }
              ,(err)=>{
                Swal.fire('error','error de comunicación, intente de nuevo!', 'error');

              }
  
            );
          }
      });

  }

  toRegisterPage(){
    this.router.navigate(['/registracion']);
  }

}

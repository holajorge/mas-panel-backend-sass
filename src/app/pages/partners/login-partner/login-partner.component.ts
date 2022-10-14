import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/service/login/login.service';
import { WalkthroughService } from 'src/app/service/walkthrough/walkthrough.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login-partner',
  templateUrl: './login-partner.component.html',
  styleUrls: ['./login-partner.component.scss']
})
export class LoginPartnerComponent implements OnInit {

  focus;
  focus1;
  constructor(
    private loginService:LoginService, 
    private router: Router, 
    public translate: TranslateService, 
    public onboardingService:WalkthroughService) {
    this.translate.use('es');
    
   }

  ngOnInit() {
  }
  login(form:NgForm){
    Swal.showLoading();
    this.loginService.authPartners(form.value).subscribe((data:any) => {  
      // console.log(data); return false;
      if(data.body.perfil != null){
        
        localStorage.setItem('admin', data.body.id);
        // localStorage.setItem('afiliado', '1');
        Swal.close();
        form.reset();

       // this.onboardingService.turn_on();
       // this.onboardingService.reset();

        this.router.navigate(['/back/empresas']);
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
                //console.log(data);
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
    this.router.navigate(['/partners/registracion']);
  }

}

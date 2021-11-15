import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';//importar para formular envio de todos los parametros
import { Router } from '@angular/router'; //para redireccionar las vistas
import { RegistracionService } from '../../service/registracion/registracion.service';
import { LoginService } from '../../service/login/login.service';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-registracion',
  templateUrl: './registracion.component.html',
  styleUrls: ['./registracion.component.scss']
})


export class RegistracionComponent implements OnInit {
  focus;
  focus1;
  disableButton = false;
  errorForm = false;
  constructor(private registracionService:RegistracionService, private router: Router, public translate: TranslateService, private loginService:LoginService, private onboardingService:WalkthroughService) {
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  ngOnInit() {

  }

  registracion(form:NgForm){
    if(this.errorForm){
        Swal.fire({
          title: "Hubo un error",
          text: "Revise los datos e intente nuevamente",
          type: "error",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        });
        return;
    }
    this.registracionService.save(form.value).subscribe((data:any) => {
        var data_login = {"usuario": form.value["email"], "password": form.value["password"]}
        this.loginService.auth(data_login).subscribe((data:any) => {
          if(data.body.perfil != null){
            localStorage.setItem('usuario', data.body.id);
            form.reset();
            this.onboardingService.turn_on();
            this.onboardingService.reset();
            this.router.navigate(['/admin/configuraciones/empresa']);
           }else{
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
            Swal.fire({
              title: "Hubo un error",
              text: "Revise los datos e intente nuevamente",
              type: "error",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-error"
            });
        });
    },
      error => {
        console.log(JSON.parse(error.error.message));
        var msg_error = JSON.parse(error.error.message)["msg"];
        console.log(msg_error)
        Swal.fire({
          title: "Hubo un error",
          text: msg_error,
          type: "error",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        });
    });
  }

  validatePageField(pagina){
    if(pagina == ""){
        this.errorForm = false;
        return false;
    }
    var aux = /^[a-zA-Z]+$/.test(pagina);
    if(aux){
        this.errorForm = false;
        return false;
    }else{
        this.errorForm = true;
        return true;
    }
  }
}
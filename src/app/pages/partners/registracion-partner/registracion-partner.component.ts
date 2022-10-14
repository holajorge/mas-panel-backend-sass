import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/service/login/login.service';
import { RegistracionService } from 'src/app/service/registracion/registracion.service';
import { WalkthroughService } from 'src/app/service/walkthrough/walkthrough.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-registracion-partner',
  templateUrl: './registracion-partner.component.html',
  styleUrls: ['./registracion-partner.component.scss']
})
export class RegistracionPartnerComponent implements OnInit {

  focus;
  focus1;
  disableButton = true;
  errorForm = false;
  flag:boolean = false;
  fieldTextType: boolean;
  flagSend:boolean = false;

  constructor(private registracionService:RegistracionService, private router: Router, 
    public translate: TranslateService, private loginService:LoginService, public onboardingService:WalkthroughService) {
    
    this.translate.use('es');
  }


  ngOnInit() {
  }

  aceptTerminos(){
    
    if(this.flag){      
      this.disableButton = false;
    }else{
      this.disableButton = true;

    }
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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
    this.disableButton = true;
    
    Swal.showLoading();

    this.registracionService.savePartner(form.value).subscribe(
      (flag) => {
          if(flag){
            Swal.fire('Listo!','Los registros se guardaron con existo','success');
            this.router.navigate(['/partners/login']);
          }else{
            Swal.fire('error!','Los registros no se guardaron con existo,intente nuevamente','error');

          }
      }, 
      (error) => {
            Swal.fire({
              title: "Hubo un error",
              text: "Revise los datos e intente nuevamente",
              type: "error",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-error"
            });
      }
    )
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

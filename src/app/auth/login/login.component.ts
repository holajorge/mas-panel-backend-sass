import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';//importar para formular envio de todos los parametros
import { Router } from '@angular/router'; //para redireccionar las vistas
import { LoginService } from '../../service/login/login.service';
import swal from "sweetalert2";
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
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }

  ngOnInit() {
   
  }

  login(form:NgForm){
    // console.log(form.value);
    this.loginService.auth(form.value).subscribe((data:any) => {  
      // console.log(data); return false;
      if(data.body.perfil != null){
        
        localStorage.setItem('usuario', data.body.id);

        form.reset();
        this.router.navigate(['/admin']);
       }else{
        swal.fire({
          title: "Hubo un error",
          text: "Revise los datos e intente nuevamente",
          type: "error",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        });
       }
    },  
      error => {  
        swal.fire({
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

}

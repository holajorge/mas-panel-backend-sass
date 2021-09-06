import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login/login.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clave',
  templateUrl: './clave.component.html',
  styles: []
})
export class ClaveComponent implements OnInit {

  token:any;
  continue:boolean = false;
  pass:string = "";
  confirm:string = "";
  entrando: false;
  enterprice:any = [];
  constructor(
    private route: ActivatedRoute, 
    private loginService:LoginService,
    private router: Router,
    public translate: TranslateService
  ){
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');

    this.route.queryParams.subscribe(params => {
      // console.log(params); 
      this.token = params.token;
      console.log(this.token);

    })


  }
  ngOnInit() {
   
    this.validartoken();

  }
  validartoken(){
    this.loginService.validateToken(this.token).subscribe(
      (data:any) => {
        
        this.continue = true;
        this.enterprice = data.body;
        console.log(this.enterprice);
      }
      ,(err)=>{
        console.log("error");
        Swal.fire('Token caducado','el token ya no es valido','error');
        this.router.navigate(['login']);
      }
    );
  }

  reset(){

    if(this.pass == this.confirm){

      this.loginService.resetpasswordfinal(this.pass.trim(), this.enterprice ).subscribe(
        (data:any) => {
          if(data.body == true){
            Swal.fire('Listo','Password cambiada con existo','success');
            this.router.navigate(['login']);
          }
          // console.log(data);
          
        }
        ,(err)=>{
          console.log("error");
          Swal.fire('error','error de comunicación intente de nuevo','error');
          
        }
      );

    }else{
      
      Swal.fire('error','password no coiciden','error');

    }

  }

}


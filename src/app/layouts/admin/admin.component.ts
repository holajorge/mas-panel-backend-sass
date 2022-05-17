import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/service/config/config.service';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isMobileResolution: boolean;
  admin:boolean = false;
  empresa: any = {id:''};
  nombre_empresa:string = "";
  dominio:string = "";
  constructor(
    public configService: ConfigService,public onboardingService:WalkthroughService, private router: Router,) {
    if (window.innerWidth < 1200) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
  @HostListener("window:resize", ["$event"])
  isMobile(event) {
    if (window.innerWidth < 1200) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
    let flag = localStorage.getItem('admin');
    if(flag){
      this.admin = true;
    }else{
      this.admin = false;
    }
    console.log(this.admin);
    this.empresa.id = localStorage.getItem('usuario');

    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
      
      if(res.response.body['configuraciones'] != ""){
        console.log(res.response.body['empresa'].nombre);
        
        this.nombre_empresa = res.response.body['empresa'].nombre;
         
        
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }

  volver(){
    localStorage.removeItem('usuario');
    this.router.navigate(['/back']);
  }

}

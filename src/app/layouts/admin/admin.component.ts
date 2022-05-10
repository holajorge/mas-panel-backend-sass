import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isMobileResolution: boolean;
  admin:boolean = false;
  constructor(public onboardingService:WalkthroughService, private router: Router,) {
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
    
  }

  volver(){
    localStorage.removeItem('usuario');
    this.router.navigate(['/back']);
  }

}

import { Component, OnInit,ElementRef } from '@angular/core';
import { ROUTES } from "../sidebar_admin/sidebar_admin.component";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { ConfigService } from 'src/app/service/config/config.service';


@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar_admin.component.html',
  styleUrls: ['./navbar_admin.component.scss']
})
export class NavbarAdminComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  sidenavOpen: boolean = true;
  empresa: any = {id:''};
  nombre_empresa:string = "";
  configuraciones:any;

  constructor(
   public configService: ConfigService,
    location: Location,private element: ElementRef,private router: Router) { 
    this.location = location;
    this.router.events.subscribe((event: Event) => {
       if (event instanceof NavigationStart) {
           // Show loading indicator

       }
       if (event instanceof NavigationEnd) {
           // Hide loading indicator

           if (window.innerWidth < 1200) {
             document.body.classList.remove("g-sidenav-pinned");
             document.body.classList.add("g-sidenav-hidden");
             this.sidenavOpen = false;
           }
       }

       if (event instanceof NavigationError) {
           // Hide loading indicator

           // Present error to user
           console.log(event.error);
       }
   });
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.empresa.id = localStorage.getItem('usuario');
    console.log(this.empresa);

    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
      
      if(res.response.body['configuraciones'] != ""){
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
        this.nombre_empresa = this.configuraciones.nombre_empresa
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }
  // logout(){
  //   localStorage.removeItem('usuario');
  //   this.router.navigate(['/login']);
  // }
  onLogout(){
    localStorage.removeItem('usuario');
    this.router.navigateByUrl('/login');
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function() {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }
  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }
  openSidebar() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }
  toggleSidenav() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }

}

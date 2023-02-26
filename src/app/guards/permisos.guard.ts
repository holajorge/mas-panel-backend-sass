import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { LoginService } from '../service/login/login.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivate {

  constructor( private router: Router, private loginService: LoginService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      
      let url = typeof next.url[0]=="undefined"?"":next.url[0].path;
      //let currentUrl = route.url.map(segment => segment.path).join('/');
     
      return this.loginService.tienePermisos(url).pipe(
        tap( permisos => {
          if(!permisos){
            this.router.navigateByUrl('/admin/tareas');
          }
        })
      )
  }
  
}

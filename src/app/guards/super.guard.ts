import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../service/login/login.service';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SuperGuard implements CanActivate {
  constructor( private router: Router, private loginService: LoginService){}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot) {

    
    return this.loginService.isAuthenticatedSuper().pipe(
      tap( estaAutenticado => {
        if(!estaAutenticado){
          this.router.navigateByUrl('/back/login');
        }
      })
    )

  }
  
}

import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http:HttpClient) { }
  user:any = {id:''};
  auth(usuario){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    console.log(usuario);
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/loginAdmin",usuario,options);
  }

  isAuthenticated():Observable<boolean>{
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    this.user.id = localStorage.getItem('usuario');
    console.log(this.user);
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/authlogin",this.user,options).pipe( map( resp => true), catchError(error => of(false) ) );
    
  }
}




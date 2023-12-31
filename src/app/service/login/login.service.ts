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
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/loginAdmin",usuario,options);
  }
  authSuper(usuario){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/loginSuper",usuario,options);
  }
  authPartners(usuario){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/loginPartners",usuario,options);
  }
  isAuthenticated():Observable<boolean>{
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    this.user.id = localStorage.getItem('usuario');
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/authlogin",this.user,options).pipe( map( resp => true), catchError(error => of(false) ) );
    
  }
  isAuthenticatedSuper():Observable<boolean>{
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    this.user.id = localStorage.getItem('admin');
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/authloginSuper",this.user,options).pipe( map( resp => true), catchError(error => of(false) ) );
    
  }
  sendemailresetpassword(email){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    let data = {email:email}

    return this._http.post(ConfigService.API_ENDPOINT() + "Backend/sendemailEmpresaResetPass",JSON.stringify(data),options).pipe(map(
      res => res,
      error => {
        return {error:true, message:error};
      }
    ));

    
  }
  validateToken(token){

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let data = {token:token}
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT() + "Backend/validateTokenEnterprice",JSON.stringify(data),options).pipe(map(
        res => res,
        error => {
            return {error:true, message:error};
        }
    ));

  } 
  resetpasswordfinal(pass,empresa){    
  
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let data = {pass:pass,empresa_id: empresa.id,token: empresa.token, apikey: empresa.apikey}
    let options = { headers: headers };
  
    return this._http.post(ConfigService.API_ENDPOINT() + "Backend/saveNewPasswordEnterprice",JSON.stringify(data),options).pipe(map(
        res => res,
        error => {
            return {error:true, message:error};
        }
    ));
  }

  tienePermisos(url):Observable<boolean>{
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    this.user.id = localStorage.getItem('usuario');
    let data = {url:url,id:this.user};
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/checkPermisos",JSON.stringify(data),options).pipe( map( resp => resp["body"]["flag"]
      ), catchError(error => of(false) ) );
    
  }

  
}




import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _http:HttpClient) { }

  get headers(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    return options;
  }

  getModulos(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getModulos",options).toPromise().then((res) =>{
      return { success: true, data:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  crearUsuario(usuario){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(ConfigService.API_ENDPOINT()+'/Backend/crearUsuario', usuario, {headers: header});
  }

  getUsuarios(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getUsuarios",options).toPromise().then((res) =>{
      return { success: true, data:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  eliminarUsuario(data){
    return this._http.post<{flag:boolean}>(ConfigService.API_ENDPOINT()+"Backend/deleteUsuario",data,this.headers)
        .pipe(
          map( (res:{flag:boolean}) => {
            let {flag} = res;
            return flag;
          }),
          // catchError( error => [])
        );   
  }

  actualizarUsuario(usuario){
    return this._http.post<{flag:boolean}>(ConfigService.API_ENDPOINT()+"Backend/actualizarUsuario",usuario)
    .pipe(
      map(
        (res:{flag:boolean})=>{
          let {flag} = res;
          return flag;
        }
       )
    )
  }

 
}

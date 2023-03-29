import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private _http:HttpClient) { }
  get header(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
   return { headers: headers };
  }
  getEmpresas(){
    return this._http.get(ConfigService.API_ENDPOINT()+"SuperAdmin/getEmpresas")
    .pipe( 
      map( (res) => { 
        let {datos} = res['body'];
        return datos;
      }),
      catchError( error => error )
    )
  }
  getEmpresasAfiliado(){
    let data = {token: localStorage.getItem('admin')};

    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/getEmpresasAfiliado", data, this.header)
    .pipe(
      map( (res) => {
        let {datos} = res['body'];
        return datos;
      }),
      catchError( error => error )
    )
  }
  getAfiliados(){
    return this._http.get(ConfigService.API_ENDPOINT()+"SuperAdmin/getAfiliados")
    .pipe(
      map( (res) => {
        let {datos} = res['body'];
        return datos;
      }),
      catchError( error => error )
    )
  }
  getTokenEmpresa(empresa){
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/getTokenEmpresa", empresa, this.header)
    .pipe( 
      map( (res) => { 
        let {datos} = res['body'];
        console.log(datos);
        
        return datos;
      }),
      catchError( error => error )
    )
  }
  getAfiliadosEmpresa(afiliadoID){
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/getAfiliadosEmpresa", afiliadoID, this.header)
    .pipe(
      map( (res) => {
        let {datos} = res['body'];
        console.log(datos);

        return datos;
      }),
      catchError( error => error )
    )
  }
  saveEmpresa(empresa){
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/saveEmpresa", empresa, this.header)
    .pipe(
      map( (res) => {
        let {flag} = res['body'];
        console.log(flag);

        return flag;
      }),
      catchError( error => error )
    )
  }
  saveAfiliado(afiliado){
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/updateAfiliado", afiliado, this.header)
    .pipe(
      map( (res) => {
        let {flag} = res['body'];
        console.log(flag);

        return flag;
      }),
      catchError( error => error )
    )
  }
  dishableAfiliado(afiliado){
    return this._http.post(ConfigService.API_ENDPOINT()+"SuperAdmin/dishableAfiliado", afiliado, this.header)
    .pipe(
      map( (res) => {
        let {flag} = res['body'];
        console.log(flag);

        return flag;
      }),
      catchError( error => error )
    )
  }


  //estados
  getEstados(data){
    
    return new Promise( (resolve) => {
      this._http.post(ConfigService.API_ENDPOINT()+"Backend/getEstados", data, this.header).subscribe(
        (resp:any) => {
          const {datos} = resp;
          resolve(datos);
        }
      );
    });

  }

  newEstados(data){
    return new Promise( (resolve) => {
      this._http.post(ConfigService.API_ENDPOINT()+"Backend/newEstados", data, this.header).subscribe(
        (resp:any) => {
          const {flag} = resp;
          resolve(flag);
        }
      );
    });
  }

  editEstados(data){
    return new Promise( (resolve) => {
      this._http.post(ConfigService.API_ENDPOINT()+"Backend/editEstado", data, this.header).subscribe(
        (resp:any) => {          
          const {flag} = resp;
          resolve(flag);
        }
      );
    });
  }

  deleteEstado(data){
    return new Promise( (resolve) => {
      this._http.post(ConfigService.API_ENDPOINT()+"Backend/deleteEstado", data, this.header).subscribe(
        (resp:any) => {          
          
          resolve(resp);
        }
      );
    });
  }

}

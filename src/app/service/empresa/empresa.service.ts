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
}

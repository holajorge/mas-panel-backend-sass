import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class TapiceService {

  constructor(private _http:HttpClient) { }
  get headers(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    return  { headers: headers };
  }

  importCSVTapice(filedata){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importProductsTapice",filedata).pipe(
      map( (resp:any) => {
        // let {flag} = resp;
        return resp;
      }),
      catchError( error => {
        return of(false)
      })
    )
  }

}

import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistracionService {

  constructor(private _http:HttpClient) { }

  save(data){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    data["user"] = data["email"];
    data["bucket"] = data["subdomain"];
    data["domain"] = data["subdomain"] + ConfigService.DOMAIN();
    data["config"] = {"subdominio": data["bucket"]};
    data["status"] = 1;
    console.log(data);
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveCompany",data,options);
  }
}

import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private _http:HttpClient) { }

  importBanner(file){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importHeader",file).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importFooter(file){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importFooter",file).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importSwal(file){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importSwal",file).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
}
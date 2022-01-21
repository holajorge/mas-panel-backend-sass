import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Banner } from 'src/app/models/banner.model';
@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private _http:HttpClient) { }
  get header(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
   return { headers: headers };
  }
  importBanner(file){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importEscritorio",file).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importFooter(file){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importMoviles",file).toPromise().then((res) =>{     
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
  eliminarEscritorio(empresa){    

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/eliminarEscritorio",empresa,this.header).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  eliminarMovil(empresa){
 
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/eliminarMoviles",empresa,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  banner(data){
    return this._http.post<{flag:boolean}>(ConfigService.API_ENDPOINT()+"Backend/newBanner",data)
      .pipe(
        map(
          (res:{flag:boolean})=>{
            let {flag} = res;
            return flag;
          }
         )
      )
    // return this._http.post(ConfigService.API_ENDPOINT()+"Backend/newBanner",data).toPromise().then((res) =>{     
    //   return { success: true, response:res};
    // })
    // .catch( (err) =>{
    //   return { success: false, msj:'Ocurrió un error en al traer los datos'};
    // });
  }
  getDataBannes(data){
    return this._http.post<{banners:Banner[]}>(ConfigService.API_ENDPOINT()+"Backend/getDataBanner",data,this.header)
        .pipe(
          map( (res:{banners:Banner[]}) => res.banners),
          // catchError( error => [])
        );      
  }
  updateBanners(data){
    return this._http.post<{flag:boolean}>(ConfigService.API_ENDPOINT()+"Backend/updateBanners",data)
      .pipe(
        map(
          (res:{flag:boolean})=>{
            let {flag} = res;
            return flag;
          }
         )
      )
  }
  eliminarBanner(data){
    return this._http.post<{flag:boolean}>(ConfigService.API_ENDPOINT()+"Backend/deleteBanner",data,this.header)
        .pipe(
          map( (res:{flag:boolean}) => {
            let {flag} = res;
            return flag;
          }),
          // catchError( error => [])
        );    
  }
}
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { catchError, debounceTime, delay, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private _http:HttpClient) { }

  public static API_ENDPOINT() :string{
  
   // return "http://localhost:8000/";
    return "https://api2.maspedidos.com.ar/";
  }

  public static DOMAIN() :string{
    return ".maspedidos.com.ar";
  }

  get headers(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    return options;
  }

  saveConfig(data){

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveConfig",data).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getConfigEmpresa(empresa){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getConfigEnterprice",empresa,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  saveDominio(data){

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveDominio",data).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  saveGenerales(data){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveGenerales",data).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  validarExisteEmail(data){

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/validaExisteCorreo",data, this.headers)
      .pipe(
        // delay(2000),
        

        map( (res:any) => {
          let {flag} = res['body'];
          return flag;
        }),
        debounceTime(5000),
        catchError( error => {
          return of(false)
        })
      );
  }
  // checkLastPass(data){
  //   return this._http.post(ConfigService.API_ENDPOINT()+"Backend/validLastPass",data, this.headers)
  //     .pipe(
  //       map( (res:any) => {
  //         let {flag} = res['body'];
  //         return flag;
  //       }),
  //       catchError( error => {
  //         return of(false)
  //       })
  //     );
  // }
  saveData(data){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveDatosCuenta",data, this.headers)
    .pipe(
      map( (res:any) => {
        let {response} = res['body'];
        return response;
      }),
      catchError( error => {
        return of(false)
      })
    );



    // let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    // let options = { headers: headers };
    
    // return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveDatosCuenta",data, options).toPromise().then((res) =>{     
    //   return { success: true, response:res};
    // })
    // .catch( (err) =>{
    //   return { success: false, msj:'Ocurrió un error en al traer los datos'};
    // });
  }
  darBaja(data){
    console.log(data);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveBajaCuenta",data, options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
}

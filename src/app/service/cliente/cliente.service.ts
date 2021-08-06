import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _http:HttpClient) { }

  getcliente(idEmpresa){
    console.log(idEmpresa);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/getClientes",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  postCliente(cliente){
    console.log(cliente);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/updateCliente",cliente,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  postInsertCliente(newCliente){
    console.log(newCliente);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/insertNewCliente",newCliente,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  postDeshabilitar(cliente){
    console.log(cliente);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/deshabilitarCliente",cliente,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  postHabilitar(cliente){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/activarCliente",cliente,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importClient(formdata){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/importCliente",formdata).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

}

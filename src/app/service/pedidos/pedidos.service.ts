import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private _http:HttpClient) { }

  getPedidos(idEmpresa){
    console.log(idEmpresa);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidos",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getDetalles(empresa){
    console.log(empresa);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDetallepedido",empresa,options).toPromise().then((res) =>{      
      return { success: true, detalles:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getGuardarComentario(comentario){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/guardarComentarioPedido",comentario,options).toPromise().then((res) =>{      
      return { success: true, resultado:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
}

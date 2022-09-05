import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private _http:HttpClient) { }


  getPaymentsList(empresa, pais){
    let data = {empresa: empresa, pais: pais};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Payments/getPaymentsList",data, options).toPromise().then((res) =>{
      if(res["status"] != '200'){
        return { success: false, msj:'Ocurrió un error en al traer los datos'};
      }
      return { success: true, list:JSON.parse(res["body"])};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  saveConfigurationGateway(empresa, configuration){
    let data = {empresa: empresa, configuration: configuration};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Payments/saveConfigurationGateway",data, options).toPromise().then((res) =>{
      if(res["status"] != '200'){
        return { success: false, msj:'Ocurrió un error al guardar los datos'};
      }
      return { success: true};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error al guardar los datos'};
    });
  }

  removeConfigurationGateway(empresa, payment){
    let data = {empresa: empresa, payment: payment};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Payments/removeConfigurationGateway",data, options).toPromise().then((res) =>{
      if(res["status"] != '200'){
        return { success: false, msj:'Ocurrió un error al eliminar los datos'};
      }
      return { success: true};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error al eliminar los datos'};
    });
  }

  activateConfigurationGateway(empresa, payment){
    let data = {empresa: empresa, payment: payment};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Payments/activateConfigurationGateway",data, options).toPromise().then((res) =>{
      if(res["status"] != '200'){
        return { success: false, msj:'Ocurrió un error al eliminar los datos'};
      }
      return { success: true};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error al eliminar los datos'};
    });
  }

  desactivateConfigurationGateway(empresa, payment){
    let data = {empresa: empresa, payment: payment};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Payments/desactivateConfigurationGateway",data, options).toPromise().then((res) =>{
      if(res["status"] != '200'){
        return { success: false, msj:'Ocurrió un error al eliminar los datos'};
      }
      return { success: true};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error al eliminar los datos'};
    });
  }

}

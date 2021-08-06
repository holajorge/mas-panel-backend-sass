import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private _http:HttpClient) { }

  getProducto(idEmpresa){
    let empresa = {id: idEmpresa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/getProductos",empresa,options).toPromise().then((res) =>{      
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  updateProducto(producto){
    console.log(producto);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/updateProducto",producto,options).toPromise().then((res) =>{      
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  createProducto(producto){

    console.log(producto);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/createProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  deshabilitar(producto){

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/dehabilitarProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  productoHabilitar(producto){

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/habilitarProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  importProducto(filedata){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"zeene/importProducts",filedata).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });


  }




}

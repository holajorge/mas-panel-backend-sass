import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { catchError, map } from 'rxjs/operators';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private _http:HttpClient) { }
  get headers(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    return options;
  }
  getPedidos(idEmpresa, vendedor = null){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    if(vendedor){
      idEmpresa["vendedor"] = vendedor;
    }
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidos",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getPedidosCliente(idEmpresa){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidosCliente",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getDetalles(empresa){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDetallepedido",empresa,options).toPromise().then((res) =>{      
      return { success: true, detalles:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  getPedidosyDetallesCliente(idEmpresa){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidosyDetallesCliente",idEmpresa,options).toPromise().then((res) =>{
      return { success: true, pedidos:res};
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
  getGuardarNota(comentario){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/guardarNotaPedido",comentario,options).toPromise().then((res) =>{      
      return { success: true, resultado:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  exportAsExcelFile(data){
    // console.log(data);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/descargarPedido",data,options).toPromise().then((res) =>{      
      return { success: true, resultado:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  
  }

  updateEstadoPedido(row){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    let id = localStorage.getItem('usuario');
   // row.id = id;
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updateEstadoPedido",row,options).toPromise().then((res) =>{
      return { success: true, resultado:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al actualizar estado'};
    });
  }

  getDistinctEstadoPedidos(data){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDistinctEstadoPedidos",data,options).toPromise().then((res) =>{
      return { success: true, resultado:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al actualizar estado'};
    });
  }

  getDistinctProvinciaClientes(data){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDistinctProvinciaClientes",data,options).toPromise().then((res) =>{
      return { success: true, resultado:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al actualizar estado'};
    });
  }

  getFileOrder(data){

    return this._http.post(ConfigService.API_ENDPOINT()+ "Api/getFilesOrder",data,this.headers )
      .pipe(
        map( (res:any) => {      
          let {files} = res;        
          return files;
        }),
        catchError( error => error)
      );
  }
  eliminarProductoPedido(data, id){

    let datos
    datos = {id:id, producto:data};

    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/eliminar_Producto_Pedido",datos,this.headers )
      .pipe(
        map( (res:any) => {      
          let {flag} = res;        
          return flag;
        }),
        catchError( error => error)
      );
  }


  getPedidosClientePorFechas(idEmpresa, date_start, date_end){
    idEmpresa["date_start"] = date_start;
    idEmpresa["date_end"] = date_end;
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidosClientePorFechas",idEmpresa,options).toPromise().then((res) =>{
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  getDatatablesFromRange(idEmpresa, date_start, date_end){
    idEmpresa["date_start"] = date_start;
    idEmpresa["date_end"] = date_end;
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDatatablesFromRange",idEmpresa,options).toPromise().then((res) =>{
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }


  getDataHydro(idEmpresa, start_date, end_date){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    idEmpresa["start_date"] = start_date;
    idEmpresa["end_date"] = end_date;
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDataHydro",idEmpresa,options).toPromise().then((res) =>{
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  getDataReports(idEmpresa){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDataReports",idEmpresa,options).toPromise().then((res) =>{
      return { success: true, data:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  getDataCaracteristica(idEmpresa, startDate, endDate){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    idEmpresa["startDate"] = startDate;
    idEmpresa["endDate"] = endDate;
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDataCaracteristica",idEmpresa,options).toPromise().then((res) =>{
      return { success: true, caracteristicas:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  editarProductoPedido(producto, empresaId){
    let datos
    datos = {id:empresaId, producto:producto};

    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/editarProductoPedido",datos,this.headers )
      .pipe(
        map( (res:any) => {      
          let {flag} = res;        
          return flag;
        }),
        catchError( error => error)
      );
  }

  armarPedido(pedido, empresaId){
    let datos
    datos = {id:empresaId, pedido:pedido};

    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/armarPedido",datos,this.headers )
      .pipe(
        map( (res:any) => {      
          let {flag} = res;        
          return flag;
        }),
        catchError( error => error)
      );
  }

  getProductosFaltantes(idEmpresa){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getProductosFaltantes",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getPedidosClienteEstado(idEmpresa,estado){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    let datos = {id:idEmpresa["id"], estado:estado};
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidosClienteEstado",datos,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  getCaracteristica(idEmpresa, numero){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    let datos = {id:idEmpresa["id"]};
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getCategoria"+numero,datos,options).toPromise().then((res) =>{      
      return { success: true, caracteristica1:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  getDetallepedidoFaltantes(empresa){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getDetallepedidoFaltantes",empresa,options).toPromise().then((res) =>{      
      return { success: true, detalles:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
}

import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _http:HttpClient) { }

  getcliente(idEmpresa){
    console.log(idEmpresa);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getClientes",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getPedidoCliente(pedido){

    console.log(pedido);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPedidosClienteModal",pedido,options).toPromise().then((res) =>{      
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
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updateCliente",cliente,options).toPromise().then((res) =>{      
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
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/insertNewCliente",newCliente,options).toPromise().then((res) =>{      
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
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/deshabilitarCliente",cliente,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  postHabilitar(cliente){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/activarCliente",cliente,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importClient(formdata){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importCliente",formdata).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  deshacerCambiosClientes(empresaa){
    let empresa = {id: empresaa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/deshacerCambiosCliente",empresa,options).toPromise().then((res) =>{      
      return { success: true, flag:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  aplaychangeClientes(empresaa){
    let empresa = {id: empresaa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/aplicarCambiosCliente",empresa,options).toPromise().then((res) =>{      
      return { success: true, flag:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  exportAsExcelFile(data, nameFile){
    
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, nameFile);

  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported'+ EXCEL_EXTENSION);
  }

}

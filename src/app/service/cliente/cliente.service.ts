import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _http:HttpClient) { }

  get headers(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    return options;
  }

  validNroClient(data){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/validNroClient",data,this.headers ).pipe(
      map( (res:any) => {
        
        let {flag} = res;
        return flag;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }
  sendEmailInvitacion(data){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/sendEmailUser",data,this.headers ).pipe(
      map( (res:any) => {
        
        let {flag} = res;
        return flag;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }
  sendEmailInvitacionTodos(data){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/sendEmailTodos",data,this.headers ).pipe(
      map( (res:any) => {
        
        let {flag} = res;
        return flag;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }


  getSucursalClient(data){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/getSucursalClient",data,this.headers ).pipe(
      map( (res:any) => {
       
        let {data} = res;
        
        return data;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }
 
  getcliente(idEmpresa){
    
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
      
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updateCliente",cliente,this.headers).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  postInsertCliente(newCliente){
    
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/insertNewCliente",newCliente,this.headers ).pipe(
      map( (res:any) => {      
        // let {flag, msg} = res;        
        return res;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }
  postInsertClienteSucursal(newSucursal){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/insertNewSucursal",newSucursal,this.headers ).pipe(
      map( (res:any) => {      
        let {flag} = res;        
        return flag;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }
  postEditClienteSucursal(newSucursal){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/editSucursal",newSucursal,this.headers ).pipe(
      map( (res:any) => {      
        let {flag} = res;        
        return flag;
      }),
      catchError( error => {
        return of(false)
      })
    );
  }
  postEliminarClienteSucursal(data){
    return this._http.post(ConfigService.API_ENDPOINT()+ "Backend/eliminarSucursalCliente",data,this.headers )
    .pipe(
      map( (res:any) => {      
        let {flag} = res;        
        return flag;
      }),
      catchError( error => {
        return of(false)
      })
    );

  }
  postDeshabilitar(cliente){
    
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
  importarSucursales(formdata){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importSucursales",formdata).toPromise().then((res) =>{      
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

  saveComprobante(data){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/saveComprobante",data).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getComprobantes(empresa){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getComprobantes",empresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  deleteComprobante(comprobante){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/eliminarComprobante",comprobante,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  updateComprobante(data){

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updateComprobante",data).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });


  }

  getTokenLogin(empresaa, usuario){
    let empresa = {id: empresaa,cliente:usuario};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getTokenUsuario",empresa,options).toPromise().then((res) =>{      
      return { success: true, flag:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

}

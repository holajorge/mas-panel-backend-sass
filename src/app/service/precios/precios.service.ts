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
export class PreciosService {

  constructor(private _http:HttpClient) { }

  createPrecio(formadd){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/createPrecio",formadd,options).toPromise().then((res) =>{     
      return { success: true, precio:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  delitePrice(formadd){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/deletePrecio",formadd,options).toPromise().then((res) =>{     
      return { success: true, precio:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  updatePrecio(formadd){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updatePrecio",formadd,options).toPromise().then((res) =>{      
      return { success: true, precio:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importPrecios(formdata){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importPrecios",formdata).toPromise().then((res) =>{      
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
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/deshacerCambiosPrecios",empresa,options).toPromise().then((res) =>{      
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
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/aplicarCambiosPrecios",empresa,options).toPromise().then((res) =>{      
      return { success: true, flag:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getPrecios(idEmpresa){
    console.log(idEmpresa);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getPrecios",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, pedidos:res};
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

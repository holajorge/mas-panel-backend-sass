import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  constructor(private _http:HttpClient) { }
  getVendedores(idEmpresa){
    console.log(idEmpresa);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getVendedores",idEmpresa,options).toPromise().then((res) =>{      
      return { success: true, vendedores:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  updateVendedor(vendedor){

    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    // let body = 'user_id='+vendedor.id+'&nombre='+user.nombre+'&correo='+user.correo+'&fecha_nacimiento='+user.fecha_naciemiento;
    return this._http.post(ConfigService.API_ENDPOINT()+'/Backend/updatevendedor', vendedor, {headers: header});

  }
  createVendedor(vendedor){
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(ConfigService.API_ENDPOINT()+'/Backend/createVendedor', vendedor, {headers: header});
  }
  getLog(vendedor){
    console.log(vendedor);
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getLogVendedor",vendedor,options).toPromise().then((res) =>{      
      return { success: true, logs:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importVendedor(filedata){

    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importVendedores",filedata).toPromise().then((res) =>{     
      return { success: true, response:res};
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
  getVendedoresData(empresa){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getVendedoresData",empresa,options).toPromise().then((res) =>{      
      return { success: true, vendedores:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }


}

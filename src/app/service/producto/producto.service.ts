import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private _http:HttpClient) { }
  get headers(){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    return  { headers: headers };
  }
  getProducto(idEmpresa){
    let empresa = {id: idEmpresa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/getProductos",empresa,options).toPromise().then((res) =>{      
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  deleteFotoProducto(foto){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/eliminarFotoProducto",foto,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  updateProducto(producto){
    // let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    // let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updateProducto",producto).toPromise().then((res) =>{      
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  createProducto(producto){

    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/createProducto",producto).toPromise().then((res) =>{     
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  deshabilitar(producto){

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/dehabilitarProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  productoHabilitar(producto){

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/habilitarProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  destacar(producto){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/destacarProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  deshalitarDestacado(producto){
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/deshablitarDestacadoProducto",producto,options).toPromise().then((res) =>{     
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  guardarcambios(empresaa){

    let empresa = {id: empresaa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/gurdarconfiguracion",empresa,options).toPromise().then((res) =>{      
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  importProducto(filedata){
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importProducts",filedata).toPromise().then((res:any) =>{   
      
        if(res?.msg){
          return {success: false, response: res.msg}
        }else{
          return { success: true, response:res};
        }
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  deshacerCambiosProductos(empresaa){

    let empresa = {id: empresaa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/deshacerCambiosProducto",empresa,options).toPromise().then((res) =>{      
      return { success: true, flag:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  aplaychangeProducts(empresaa){
    let empresa = {id: empresaa};
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/aplicarCambiosProducto",empresa,options).toPromise().then((res) =>{      
      return { success: true, flag:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  importPhoto(filedata){
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/importPhotoProduct",filedata).toPromise().then((res) =>{     
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
  updateProductCaract(producto){

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = { headers: headers };
    
    return this._http.post(ConfigService.API_ENDPOINT()+"Backend/updateCaractProduct",producto,options).toPromise().then((res) =>{     
      return { success: true, productos:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });

  }
  deleteProduct(data){

    return this._http.post<boolean>(ConfigService.API_ENDPOINT()+"Backend/eliminarProducto", data,this.headers)
      .pipe(
        map( (res:any) => {
          let {flag} = res;            
            return flag;
          }
        ),            
        catchError( error => {
          console.log(error);          
          return of(false)
        })
      );          
  }
  activeAllProduct(data){
    return this._http
      .post<boolean>(ConfigService.API_ENDPOINT()+"Backend/activarProductoTodos", data,this.headers)
      .pipe(
        map( (res:any) => {
          let {flag} = res;            
            return flag;
          }
        ),            
        catchError( error => {
          console.log(error);          
          return of(false)
        })
      );    
  }
  desactivarAllProduct(data){
    return this._http
      .post<boolean>(ConfigService.API_ENDPOINT()+"Backend/desactivarProductoTodos", data,this.headers)
      .pipe(
        map( (res:any) => {
          let {flag} = res;            
            return flag;
          }
        ),            
        catchError( error => {
          console.log(error);          
          return of(false)
        })
      );    
  }

  onImgError(event){
    event.target.src = 'https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/nofoto.png';
  }

}

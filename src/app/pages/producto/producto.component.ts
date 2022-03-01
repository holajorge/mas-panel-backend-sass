import { Component, OnInit,ViewChild, ElementRef, TemplateRef,Injectable } from '@angular/core';
import {TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ProductoService } from '../../service/producto/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

const I18N_VALUES = {
  'pt': {
    weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dez'],
    weekLabel: 'sem'
  }
};

@Injectable()
export class I18n {
  language = 'pt';
}
export abstract class TranslateParser {
  /**
   * Interpolates a string to replace parameters
   * "This is a {{ key }}" ==> "This is a value", with params = { key: "value" }
   * @param expr
   * @param params
   * @returns {string}
   */
  abstract interpolate(expr: string | Function, params?: any): string;
}
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) { super(); }

  getWeekdayShortName(weekday: number): string { return I18N_VALUES[this._i18n.language].weekdays[weekday - 1]; }
  getWeekLabel(): string { return I18N_VALUES[this._i18n.language].weekLabel; }
  getMonthShortName(month: number): string { return I18N_VALUES[this._i18n.language].months[month - 1]; }
  getMonthFullName(month: number): string { return this.getMonthShortName(month); }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.day}-${date.month}-${date.year}`; }
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] 
})
export class ProductoComponent implements OnInit {
  
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static modal-content-custom", 
  };
  model: NgbDateStruct;
  empresa:any = "";
  rows:any = [];
  rowsTemp:any = [];
  arrayCaracteristica1:any = [];
  arrayCaracteristica2:any = [];
  arrayCaracteristica3:any = [];
  arrayCaracteristica4:any = [];
  caracteristica1:any = [];
  caracteristica2:any = [];
  caracteristica3:any = [];
  caracteristica4:any = [];
  arrayDestacados:any = [
    {nombre: 'Destacado', id:"1"},
    {nombre: 'No destacado', id:"0"},
    // {nombre: 'ambos', id:""}
  ];
  entries: number = 10;
  entriesDestacados: number = 10;
  editForm: FormGroup;
  activeRow:any;
  btnvisibility:boolean = true;
  btnvisibilityIn:boolean = true;
  fecha: '';
  producto:any = {id:'',empresa_id: ''};
  destacados:any = [];
  cambios:boolean = false;
  
  addTextCaract:boolean = false;
  addTextCaract2:boolean = false;
  addTextCaract3:boolean = false;
  addTextCaract4:boolean = false;

  ver_agregar_1 = false;
  ver_agregar_2 = false;
  ver_agregar_3 = false;
  ver_agregar_4 = false;

  configuraciones:any = [];
  textCaract1:any = "";
  textCaract2:any = "";
  textCaract3:any = "";
  textCaract4:any = "";
  // caract4:any = [];
  enableSummary = true;
  summaryPosition = 'top';
  form_dataConfig:any=[];
  textAddOrEdit:boolean = false;
  bucket:string = "";
  fotos:any;
  listaCop:any;
  listaTemp:any = [];
  selectCara1:any = "";
  selectCara2:any="";
  selectCara3:any="";
  codigoP:any = "";
  selectDest:any = "";
  flagProductList:boolean;
  flagCarat1:boolean;
  flagCarat2:boolean;
  flagCarat3:boolean;
  flagCarat4:boolean;
  tituloP:string="";
  myFiles:string [] = [];
  cont: any = 0;
  activoCliente:boolean = false;
  
  constructor(public translate: TranslateService,
    public productoService: ProductoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,  
    public onboardingService:WalkthroughService
  ) {
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.getProductos();
    this.editForm = this.formBuilder.group({
      id: [''],
      empresa_id: [],
      titulo: ['', Validators.required],
      codigo_producto: ['',Validators.required],
      precio: ['',Validators.required],
      stock: [''],
      caracteristica1: [''],
      caracteristica2: [''],
      caracteristica3: [''],
      caracteristica4: [''],
      solapa1: [''],
      solapa2: [''],
      cantidad_minima: [''],
      precio_oferta: [''],
      destacado: [''],
      status: [''],
      sync: [''],
      fecha_sync: [''],
      stock_minimo: [''],
      descripcion: [''],
      logoo: [null],
      foto: [null],
      unit:['',null],
      multiplo:['1']
      
    });
    
  }
  onSelectItem(modalEditProducto,row) {
    this.textAddOrEdit = true;
    
    let fotosArray = JSON.parse(row.fotos);
    console.log(fotosArray);
    if(!fotosArray){
      this.fotos = [];
    }else{
      this.fotos = fotosArray.map( (val) =>{
        return {
          img: "https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/"+this.bucket+"/fotos/"+val,
          id: row.id,
          nombre: val
        };          
      });
    }
    
    
    this.editForm.patchValue({
      id: row.id,
      empresa_id: row.empresa_id,
      titulo:row.titulo, 
      codigo_producto:row.codigo,
      precio:row.precio, 
      stock:row.stock, 
      caracteristica1:row.caracteristica1, 
      caracteristica2:row.caracteristica2, 
      caracteristica3:row.caracteristica3, 
      caracteristica4:row.caracteristica4,       
      solapa1:row.solapa1, 
      solapa2:row.solapa2, 
      cantidad_minima:row.cantidad_minima, 
      precio_oferta:row.precio_oferta, 
      destacado: (row.destacado == 1) ? true : false, 
      status: (row.activo == 1) ? true : false, 
      sync:row.sync, 
      fecha_sync: row.fecha_sync,
      stock_minimo: row.stock_minimo,
      descripcion: row.descripcion,
      unit: row.unidad_bulto,
      multiplo: row.multiplo
    });
    this.btnvisibility = false;  
    this.btnvisibilityIn = true;  
    this.notificationModal = this.modalService.show(
      modalEditProducto,
      this.notification
    );

  }
  deleteAll(){
    let data = {all: true,id: this.empresa };
    Swal.fire({
      title: 'Confirma eliminar todos los productos?',
      text: "Se eliminarán todos los productos permanentemente",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, eliminar todo',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
      if (result.value) {      
        Swal.showLoading();
        this.productoService.deleteProduct(data).subscribe(
          (res) => {
            console.log(res);
            
            if(res){
              Swal.fire('listo','Productos eliminado con éxito','success');
              this.getProductos();
            }else{
              Swal.fire('error','No fue posible eliminar todos los productos, verifique conexion e intente de nuevo','error');  
            }        
          },
          (error) => {
            Swal.fire('error','No fue posible eliminar todos los productos, verifique conexion e intente de nuevo','error');  
          }
        );
      }
    })
  }
  deleteProduct(idProduct){
    let data = {one: true,_id: idProduct,id: this.empresa };
    Swal.fire({
      title: 'Seguro de eliminar?',
      text: "El producto se eliminará permanentemente",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
      if (result.value) {      
        Swal.showLoading();
        this.productoService.deleteProduct(data).subscribe(
          (res) => {
            console.log(res);
            
            if(res){
              Swal.fire('listo','Producto eliminado con éxito','success');
              this.getProductos();
            }else{
              Swal.fire('error','No fue posible eliminar el producto, verifique conexion e intente de nuevo','error');  
            }        
          },
          (error) => {
            Swal.fire('error','No fue posible eliminar el producto, verifique conexion e intente de nuevo','error');  
          }
        );
      }
    })
  }

  activeAll(){
    let data = {id: this.empresa };
    Swal.fire({
      title: 'Seguro de activar todos los productos?',
      text: "Se activarán todos los productos!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Activar todos!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
      if (result.value) {      
        Swal.showLoading();
        this.productoService.activeAllProduct(data).subscribe(
          (res) => {
            console.log(res);
            
            if(res){
              Swal.fire('listo','Se activaron todos los producto con éxito','success');
              this.getProductos();
            }else{
              Swal.fire('error','No fue posible activar todos los productos, verifique conexion e intente de nuevo','error');  
            }        
          },
          (error) => {
            Swal.fire('error','No fue posible activar todos los productos, verifique conexion e intente de nuevo','error');  
          }
        );
      }
    })
  }
  disableAll(){
    let data = {id: this.empresa };
    Swal.fire({
      title: 'Confirma desactivar todos los productos?',
      text: "Se desactivarán todos los productos",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Si, desactivar todos!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
      if (result.value) {      
        Swal.showLoading();

        this.productoService.desactivarAllProduct(data).subscribe(
          (res) => {
            console.log(res);
            
            if(res){
              Swal.fire('listo','Se desactivaron todos los producto con éxito','success');
              this.getProductos();
            }else{
              Swal.fire('error','no fue posible desactivar todos los productos, verifique conexion e intente de nuevo','error');  
            }        
          },
          (error) => {
            Swal.fire('error','no fue posible desactivar todos los productos, verifique conexion e intente de nuevo','error');  
          }
        );
      }
    })
  }

  getProductos(){ 
    Swal.showLoading();
    this.productoService.getProducto(this.empresa).then( (res:any) =>{    
      if(res.success){
      
        Swal.close();
        // if(res.productos['productos'].length > 0){
          // this.flagProductList = true;
          this.bucket = res.productos['empresa'].bucket;
          
          this.rows = res.productos['productos'];
          console.log(this.rows);
          
          this.rowsTemp = res.productos['productos'];
          this.listaCop = res.productos['productos'];
          this.filtraCat();
          
          this.arrayCaracteristica1 = res.productos['caracteristica1'];
          this.arrayCaracteristica2 = res.productos['caracteristica2'];
          this.arrayCaracteristica3 = res.productos['caracteristica3'];
          this.arrayCaracteristica4 = res.productos['caracteristica4'];

          this.configuraciones = res.productos['configuraciones'];
          if(this.configuraciones == false || this.configuraciones == null){
            this.textCaract1 = false;
            this.textCaract2 = false;
            this.textCaract3 = false;
            this.textCaract4 = false;      

          }else{

            this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : false;
            this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : false;
            this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : false;
            this.textCaract4 = (this.configuraciones.caracteristica4 != "") ? this.configuraciones.caracteristica4 : false;
            
            if(this.textCaract4 == undefined){
              this.textCaract4 = false;
            }

          }
     
      }else{
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });

  }
  addNewCarat1(){
    console.log("entra aqui");
    this.ver_agregar_1 = !this.ver_agregar_1;
    this.addTextCaract =! this.addTextCaract;
    const car1 = this.editForm.get('caracteristica1').value;    
    if(typeof  car1){
      this.editForm.patchValue({
        caracteristica1: null
      })
    }
  }
  alert(e){
    console.log(e);
  }
  addNewCarat2(){

    this.ver_agregar_2 = !this.ver_agregar_2;
    this.addTextCaract2 =! this.addTextCaract2;
    const car2 = this.editForm.get('caracteristica2').value;    
    if(typeof  car2){
      this.editForm.patchValue({
        caracteristica2: null
      })
    }
  }
  addNewCarat3(){

    this.ver_agregar_3 = !this.ver_agregar_3;
    this.addTextCaract3 =! this.addTextCaract3;
    const car3 = this.editForm.get('caracteristica3').value;    
    if(typeof  car3){
      this.editForm.patchValue({
        caracteristica3: null
      })
    }
  }
  addNewCarat4(){

    this.ver_agregar_4 = !this.ver_agregar_4;
    this.addTextCaract4 =! this.addTextCaract4;
    const car4 = this.editForm.get('caracteristica4').value;    
    if(typeof  car4){
      this.editForm.patchValue({
        caracteristica4: null
      })
    }
  }
  showPreviewHeader(event) {
    const file = (event.target as HTMLInputElement).files[0];    
    const files:FileList = event.target.files;    
    this.editForm.patchValue({logo: file});
    this.editForm.get('foto').updateValueAndValidity();
    this.myFiles = [];

    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){        

        let formData = new FormData();
        for (var i = 0; i < event.target.files.length; i++) { 
          this.myFiles.push(event.target.files[i]);
        }

        formData.append('foto', (event.target as HTMLInputElement).files[0], file.name);
        this.form_dataConfig = formData;

      }else{
        Swal.fire('Error al importar o archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }
  }
  getNames(): string[] {
    return this.rows.map(row => row.titulo).map(fullName => fullName.split(' ')[1]);
  } 
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  entriesChangeDestacados($event){
    this.entriesDestacados = $event.target.value;

  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
      
    let listaTemp = [];
    if(val !== ''){
      if(this.rows.length > 0){
        listaTemp = this.listaCop.filter(function(d) {          

          for(var key in d){       
            let buscar = "";    
            console.log("pasa aqui");    
            if(key === "codigo" || key === "caracteristica1" || key === "caracteristica2" || key === "caracteristica3"){          

              if(typeof d[key] ){
                buscar = d[key].toString().toLowerCase();
              }else{
                buscar = d[key].toLowerCase();
              }
              if( buscar != null && buscar.indexOf(val) !== -1){
                return true;
              }
            }
          }
          return false;
        });
        this.rows = listaTemp;
      }else{
        this.rows = this.listaCop;
        this.filterTable(event);
      }
      
    }else{
      this.rows = this.listaCop;
    }
  }
  
  filtraCat(){
         
    const car1 = this.selectCara1;
    const car2 = this.selectCara2;
    const car3 = this.selectCara3;
    const code = this.codigoP;
    // const check = this.selectDest;
    const titulo = this.tituloP;
    let activo = null;
   
    
    if(this.cont == 1){
      activo = true
    }else{
      activo = (this.activoCliente == true) ? true : false;
    }
    const filtros = {
      codigo: [code, d => d['codigo'].includes(code)],
      caracteristica1: [car1, d => d['caracteristica1'].includes(car1)],
      caracteristica2: [car2, d => d['caracteristica2'].includes(car2)],
      caracteristica3: [car3, d => d['caracteristica3'].includes(car3)],
      // destacado: [check, d => d['destacado'] === check],
      activo: [activo, d => {
        if(d['destacado'] == "1"){
          return true;
        }
      }],
      titulo: [titulo, d =>{
        let tituloCase = d['titulo'].toLowerCase();
        if(tituloCase.includes(titulo.toLocaleLowerCase())){
          return true;
        }
        // d['titulo'].includes(titulo);
      }] 
    }
    // console.log(check);
    
    let producto1 = this.listaCop;  
    for (const filtro in filtros) {
      if(filtros[filtro][0]){
        producto1 = producto1.filter( filtros[filtro][1])   
      }
    }         
    this.rows = producto1;        
  }
  cambia(){
    this.cont++;
    console.log('input chek esta en:', this.activoCliente);

    console.log('contador vale:', this.cont);
    this.activoCliente = (this.activoCliente == true) ? false : true;

    console.log('check esta en:', this.activoCliente);
    this.filtraCat();
  }
  eliminar(){
    this.selectCara1 = null;
    this.selectCara2 = null;
    this.selectCara3 = null;
    this.codigoP = '';
    this.selectDest = null;
    this.rows = this.listaCop;
  }
  chekDestacado(){
    
    this.selectDest = (this.selectDest) ? false : true;
    const car1 = (this.selectCara1 == '' || this.selectCara1 == undefined) ? '' : this.selectCara1;
    const car2 = (this.selectCara2 == '' || this.selectCara2 == undefined) ? '' : this.selectCara2;
    const car3 = (this.selectCara3 == '' || this.selectCara3 == undefined) ? '' : this.selectCara3;
    const code = (this.codigoP == '' ||  this.codigoP == undefined) ? '' :  this.codigoP;
    const chek = this.selectDest;
    let producto1 = [];  
      producto1 = this.listaCop.filter(function(d) {      
        
          if(d['destacado'] == chek || d['codigo'].indexOf(code) !== -1 || d['caracteristica1'].includes(car1) || d['caracteristica2'].includes(car2) ||  d['caracteristica3'].includes(car3)){
            
            return true;
          }
      });
      this.rows = producto1;
  }

  filterTableDestacado(event){
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      const temRow = this.destacados.filter(function (d) {
      
        for (var key in d) {
          if(!Array.isArray(d[key])){      
            let hola = (d[key] != null) ? d[key].toLowerCase() : '';
            if ( hola.indexOf(val) !== -1) {
              return true;
            }      

          }  
        }
        return false;
      });
      this.destacados = temRow;
    }else{
      this.destacados = this.destacados;
    }    
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  updateProduct(){
    
    let formData = new FormData();
    if(Array.isArray(this.form_dataConfig)){

    }else{
      for (var i = 0; i < this.myFiles.length; i++) { 
        formData.append("fotos[]", this.myFiles[i]);
      }
      formData.append('foto[]',this.form_dataConfig.get('foto'));
    }
    
    const caract1 = this.editForm.get('caracteristica1').value;
    const caract2 = this.editForm.get('caracteristica2').value;
    const caract3 = this.editForm.get('caracteristica3').value;
    const caract4 = this.editForm.get('caracteristica4').value;

    let ca1 = "";
    let ca2 = "";
    let ca3 = "";
    let ca4 = "";
    ca1 = this.validateStringCaract(caract1);
    ca2 = this.validateStringCaract(caract2);
    ca3 = this.validateStringCaract(caract3);
    ca4 = this.validateStringCaract(caract4);
    
    formData.append('cantidad_minima',this.editForm.get('cantidad_minima').value);
    formData.append('caracteristica1',ca1);
    formData.append('caracteristica2',ca2);
    formData.append('caracteristica3',ca3);
    formData.append('caracteristica4',ca4);
    formData.append('codigo_producto',this.editForm.get('codigo_producto').value);
    formData.append('descripcion',this.editForm.get('descripcion').value);
    formData.append('destacado',this.editForm.get('destacado').value);
    formData.append('unit',this.editForm.get('unit').value);
    formData.append('status',this.editForm.get('status').value);
    formData.append('empresa_id',this.editForm.get('empresa_id').value);
    formData.append('fecha_sync',this.editForm.get('fecha_sync').value);
    formData.append('id',this.editForm.get('id').value);
    // formData.append('logoo',this.editForm.get('logoo').value);
    formData.append('precio',this.editForm.get('precio').value);
    formData.append('precio_oferta',this.editForm.get('precio_oferta').value);
    formData.append('solapa1',this.editForm.get('solapa1').value);
    formData.append('solapa2',this.editForm.get('solapa2').value);
    formData.append('stock',this.editForm.get('stock').value);
    formData.append('stock_minimo',this.editForm.get('stock_minimo').value);
    formData.append('sync',this.editForm.get('sync').value);
    formData.append('titulo',this.editForm.get('titulo').value);
    formData.append('multiplo',this.editForm.get('multiplo').value);
    Swal.showLoading();
    this.productoService.updateProducto(formData).then( (res:any) =>{    
      if(res.success == true){
        this.notificationModal.hide();
        this.editForm.reset();
        this.getProductos();
        this.myFiles = [];
        
        Swal.fire('Listo!','Producto editado con éxito!', 'success')
        this.addTextCaract = false;
        this.addTextCaract2 = false;
        this.addTextCaract3 = false;

      }else{
        Swal.fire('Editar Error, intente nuevamente', 'error')

      }

    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  validateStringCaract(caractNum){
    if(!caractNum){
      caractNum = "";
    }
    if(this.isKeyExists(caractNum,'nombre')){
      return  caractNum.nombre;
    }else{
      if(caractNum != "" ){
        return caractNum;
      }else{
        return caractNum;
      }
    }
    
  }
  cerrarmodal(){
    this.myFiles = [];
    this.notificationModal.hide();
  }
  insertProduct(){   
    
    let formData = new FormData();

    if(Array.isArray(this.form_dataConfig)){

    }else{
      for (var i = 0; i < this.myFiles.length; i++) { 
        formData.append("fotos[]", this.myFiles[i]);
      }
      formData.append('foto[]',this.form_dataConfig.get('foto'));
    }
    let status = this.editForm.get('status').value;
    if(status == null){
      status = false;
    }
    let caract1 = this.editForm.get('caracteristica1').value;
    let caract2 = this.editForm.get('caracteristica2').value;
    let caract3 = this.editForm.get('caracteristica3').value;
    let caract4 = this.editForm.get('caracteristica3').value;

    let ca1 = "";
    let ca2 = "";
    let ca3 = "";
    let ca4 = "";
    ca1 = this.validateStringCaract(caract1);
    ca2 = this.validateStringCaract(caract2);
    ca3 = this.validateStringCaract(caract3);
    ca4 = this.validateStringCaract(caract4);
   
    formData.append('cantidad_minima',this.editForm.get('cantidad_minima').value);
    formData.append('caracteristica1',ca1);
    formData.append('caracteristica2',ca2);
    formData.append('caracteristica3',ca3);
    formData.append('caracteristica4',ca4);
    formData.append('codigo_producto',this.editForm.get('codigo_producto').value);
    formData.append('descripcion',this.editForm.get('descripcion').value);
    formData.append('destacado',this.editForm.get('destacado').value);
    formData.append('empresa_id',this.editForm.get('empresa_id').value);
    formData.append('fecha_sync',this.editForm.get('fecha_sync').value);
    // formData.append('id',this.editForm.get('id').value);
    // formData.append('logoo',this.editForm.get('logoo').value);
    formData.append('unit',this.editForm.get('unit').value);
    formData.append('status',status);
    formData.append('precio',this.editForm.get('precio').value);
    formData.append('precio_oferta',this.editForm.get('precio_oferta').value);
    formData.append('solapa1',this.editForm.get('solapa1').value);
    formData.append('solapa2',this.editForm.get('solapa2').value);
    formData.append('stock',this.editForm.get('stock').value);
    formData.append('stock_minimo',this.editForm.get('stock_minimo').value);
    formData.append('sync',this.editForm.get('sync').value);
    formData.append('titulo',this.editForm.get('titulo').value);
    formData.append('multiplo',this.editForm.get('multiplo').value);

    Swal.showLoading();
    this.productoService.createProducto(formData).then( (res:any) =>{    
      if(res.productos.body.usuario == 2){
        Swal.fire('Error', 'Código de producto ya existe', 'error');      
      }else if(res.productos.body.usuario == 1){
        this.notificationModal.hide();
        this.editForm.reset();
        this.getProductos();
        this.filtraCat();
        this.myFiles = [];
        Swal.fire('Listo!','Producto creado con éxito!', 'success')
      }else{
        Swal.fire('Editar Erro, intente nuevamente', 'error')
      }
      
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  
  isKeyExists(obj,key){
    if( obj[key] == undefined ){
        return false;
    }else{
        return true;
    }
  }
  newProduct(modalEditProducto){
    this.textAddOrEdit = false;
    this.fotos = [];
    this.editForm.reset();
 
    this.notificationModal = this.modalService.show(
      modalEditProducto,
      this.notification
    );
    this.editForm.patchValue({
      empresa_id: this.empresa
    });

    // console.log(this.editForm.value);
    this.btnvisibility = true;  
    this.btnvisibilityIn = false; 


  }
  onActiveClient(row){    
    console.log(row);
    Swal.fire({
      title: 'Seguro de habilitar el producto?',
      text: "Habilitar producto!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Habilitar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          this.available(row);
        }
    })
  }
  available(row){
    this.producto.id = row.id;
    this.producto.empresa_id = this.empresa;

    this.productoService.productoHabilitar(this.producto).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Producto habilitado con éxito!', 'success')
        this.getProductos();
      }else{
        Swal.fire('Upps!','Erro al habilitar al Producto, intente nuevamente!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });

  }

  onDisableActive(row){    
    Swal.fire({
      title: 'Seguro de deshabilitar el producto?',
      text: "Deshabilitará al producto!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Deshabilitar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          this.disable(row);
        }
    })
  }

  disable(row){
    this.producto.id = row.id;
    this.producto.empresa_id = this.empresa;

    this.productoService.deshabilitar(this.producto).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Producto deshabilitado con éxito!', 'success')
        this.getProductos();
      }else{
        Swal.fire('Upps!','Error al deshabilitar al producto, intente nuevamente!', 'error')
      }
    }).catch(err=>{
      console.log(err);
    });
  }

  modalFoto(modalfoto,row){

    this.notificationModal = this.modalService.show(
      modalfoto,
      this.notification
    );
  }

  destacadoProducts(modaDestacadoProducto){
    
    if(this.rows.length > 0){

      this.destacados = this.rows.filter( function(p){
        if(p.destacado == 1){
          return p;
        }
      });
      this.notificationModal = this.modalService.show(modaDestacadoProducto,this.notification);
    }else{
      Swal.fire('upss!','Primero debe cargar al menos un producto!', 'success')
    }
    
  }
  habilitarDestacado(row){
    this.producto.id = row.id;
    this.producto.empresa_id = this.empresa;
    console.log(row);
    Swal.fire({
      title: 'Seguro de Habilitar producto como Destacado?',
      text: "Destacar producto!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Habilitar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          
          this.productoService.destacar(this.producto).then( (res:any) =>{    
            if(res.response == true){
              this.cambios = true;
              Swal.fire('Listo!','Producto destacado con éxito!', 'success')
              this.getProductos();
            }else{
              Swal.fire('Upps!','Error al habilitar producto como destacado, intente nuevamente!', 'error')
            }
          }).catch(err=>{
            console.log(err);
          });
        }
    }) 
  }
  deshabilitarDestacado(row){
    this.producto.id = row.id;
    this.producto.empresa_id = this.empresa;
    console.log(row);
    Swal.fire({
      title: 'Seguro de deshabilitar el producto como destacado?',
      text: "Deshabilitar producto como destacado!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Deshabilitar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          
          this.productoService.deshalitarDestacado(this.producto).then( (res:any) =>{    
            if(res.response == true){
              this.cambios = true;
              Swal.fire('Listo!','Producto no destacado con éxito!', 'success')
              this.getProductos();
            }else{
              Swal.fire('Upps!','Error al deshabilitar producto como no destacado, intente nuevamente!', 'error')
            }
          }).catch(err=>{
            console.log(err);
          });
        }
    })
    
  }
  gurdarcambios(){

    Swal.showLoading();
    this.productoService.guardarcambios(this.empresa).then( (res:any) =>{    
      console.log(res);
      if(res.success == true){
        Swal.fire('Listo!','Cambios ejecutados con éxito!', 'success');
      }else{
        Swal.fire('Upps!','Error al guardar los cambios, intente nuevamente!', 'error');
      }
    }).catch(err=>{
      console.log(err);
    });

  }
  eliminarFoto(foto, index){

    console.log(index);
    console.log(this.fotos);

    Swal.fire({
      title: 'Seguro de eliminar esta '+foto.nombre+' foto del producto?',
      text: "Eliminar foto producto!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          
          this.productoService.deleteFotoProducto(foto).then( (res:any) =>{    
            if(res.success == true){
              this.cambios = true;
              Swal.fire('Listo!','Foto eliminada con éxito!', 'success')
              this.getProductos();
              this.fotos.splice(index,1);

            }else{
              Swal.fire('Upps!','Error al eliminar foto del producto, intente nuevamente!', 'error')
            }
          }).catch(err=>{
            Swal.fire('Upps!','Error al eliminar foto del producto, intente nuevamente!', 'error')
            console.log(err);
          });
        }
    }) 
    

  }
}

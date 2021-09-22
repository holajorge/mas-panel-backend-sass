import { Component, OnInit,ViewChild, ElementRef, TemplateRef,Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ProductoService } from '../../service/producto/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { NgbDateStruct,NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

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
    class: "modal-dialog-centered modal-xl static", 
  };
  model: NgbDateStruct;
  empresa:any = "";
  rows:any = [];
  rowsTemp:any = [];
  arrayCaracteristica1:any = [];
  arrayCaracteristica2:any = [];
  arrayCaracteristica3:any = [];
  caracteristica2:any = [];
  caracteristica3:any = [];
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
  configuraciones:any = [];
  textCaract1:string = "";
  textCaract2:string = "";
  textCaract3:string = "";
  
  constructor(public translate: TranslateService,public productoService: ProductoService,
    private modalService: BsModalService,private formBuilder: FormBuilder) {
    this.translate.addLangs(['en','es','pt']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.empresa = localStorage.getItem('usuario');

  }

  ngOnInit() {
    this.getProductos();
    this.editForm = this.formBuilder.group({
      id: [''],
      empresa_id: [],
      titulo: [''],
      codigo_producto: [''],
      precio: [''],
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
      sync: [''],
      fecha_sync: [''],
      stock_minimo: [''],
      descripcion: [''],
    });
  }
  onSelectItem(modalEditProducto,row) {
    
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
      destacado:row.destacado, 
      sync:row.sync, 
      fecha_sync: row.fecha_sync,
      stock_minimo: row.stock_minimo,
      descripcion: row.descripcion      
    });
    this.btnvisibility = false;  
    this.btnvisibilityIn = true;  
    this.notificationModal = this.modalService.show(
      modalEditProducto,
      this.notification
    );

  }
  getProductos(){ 
    Swal.showLoading();
    this.productoService.getProducto(this.empresa).then( (res:any) =>{    
      if(res.success){
        Swal.close();
        this.rows = res.productos['productos'];
        this.rowsTemp = res.productos['productos'];
        this.arrayCaracteristica1 = res.productos['caracteristica1'];
        this.arrayCaracteristica2 = res.productos['caracteristica2'];
        this.arrayCaracteristica3 = res.productos['caracteristica3'];
        this.configuraciones = res.productos['configuraciones'];
        this.textCaract1 = (this.configuraciones.caracteristica1 != "") ? this.configuraciones.caracteristica1 : "caracteristica 1"
        this.textCaract2 = (this.configuraciones.caracteristica2 != "") ? this.configuraciones.caracteristica2 : "caracteristica 2"
        this.textCaract3 = (this.configuraciones.caracteristica3 != "") ? this.configuraciones.caracteristica3 : "caracteristica 3"
      }else{
        Swal.close();
      }
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  entriesChangeDestacados($event){
    this.entriesDestacados = $event.target.value;

  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      // filter our data
      const temRow = this.rows.filter(function (d) {
      
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
      this.rows = temRow;
    }else{
      this.rows = this.rowsTemp;
    }    
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

    this.productoService.updateProducto(this.editForm.value).then( (res:any) =>{    
      if(res.success == true){
        this.notificationModal.hide();
        this.editForm.reset();
        this.getProductos();
        Swal.fire('Listo!','Producto Editardo, con sucesso!', 'success')
        this.addTextCaract = false;
        this.addTextCaract2 = false;
        this.addTextCaract3 = false;

      }else{
        Swal.fire('Editar Error, intente nuevamente', 'error')

      }

    }).catch(err=>{
      console.log(err);
    });
  }
  insertProduct(){

    this.productoService.createProducto(this.editForm.value).then( (res:any) =>{    
      if(res.productos.body.usuario == 2){
        Swal.fire('Error', 'Codigo producto ya existe', 'error');      
      }else if(res.productos.body.usuario == 1){
        this.notificationModal.hide();
        this.editForm.reset();
        this.getProductos();
        Swal.fire('Listo!','Producto creado, con exito!', 'success')
      }else{
        Swal.fire('Editar Erro, intente novamente', 'error')
      }
      
    }).catch(err=>{
      console.log(err);
    });
  }

  newProduct(modalEditProducto){
    this.editForm.reset();
 
    this.notificationModal = this.modalService.show(
      modalEditProducto,
      this.notification
    );
    this.editForm.patchValue({
      empresa_id: this.empresa
    });

    console.log(this.editForm.value);
    this.btnvisibility = true;  
    this.btnvisibilityIn = false; 


  }
  onActiveClient(row){    
    console.log(row);
    Swal.fire({
      title: 'segurdo de Habilitar?',
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

    this.productoService.productoHabilitar(this.producto).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Producto habilitado con exito!', 'success')
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
      title: 'segurdo de deshabilitar?',
      text: "Desabilitara al producto!",
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
    this.productoService.deshabilitar(this.producto).then( (res:any) =>{    
      if(res.response == true){
        Swal.fire('Listo!','Producto deshabilitado con exito!', 'success')
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
      title: 'segurdo de Habilitar producto como Destacado?',
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
              Swal.fire('Listo!','Producto destacado con exito!', 'success')
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
      title: 'segurdo de Deshabilitar producto como Destacado?',
      text: "Deshabilitar destacado producto!",
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
              Swal.fire('Listo!','Producto no destacado con exito!', 'success')
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
        Swal.fire('Listo!','cambios ejecutados con exito!', 'success');
      }else{
        Swal.fire('Upps!','Error al guardar los cambios, intente nuevamente!', 'error');
      }
    }).catch(err=>{
      console.log(err);
    });

  }
}

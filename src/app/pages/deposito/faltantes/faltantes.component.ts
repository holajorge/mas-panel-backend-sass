import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-faltantes',
  templateUrl: './faltantes.component.html',
  styleUrls: ['./faltantes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaltantesComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog2",
  };
  panelFiltro = {
    keyboard: true,
    class: "my-modal"
  }
  armado: boolean = false;
  faltante: boolean = false;
  activeRow: any;
  activeRowDet: any;
  empresa:any = {id:'', pedido:''};
  temRow:any = [];
  temRowDet:any = [];
  temp = [];
  detalleRow = [];
  detalleSucursal;
  detalleId;
  tempRow = [];
  tempRowDet:any = [];
  loadingIndicator = true;
  entries: number = 10;
  entriesDet: number = 10;
  addForm: FormGroup;
  btnvisibility: boolean = true;  
  emptyTable:boolean = false;
  dataExcel: any = [];
  nroPedido:string = "";
  nroCliente:string = "";
  nroProveedor:string = "";
  dateStart:any;
  dateEnd:any;
  lista_estados: any = [];
  lista_estadosFiltros: any = [];
  listaCaracteristica1: any = []; 
  listaCaracteristica2: any = [];
  listaCaracteristica3: any = [];
  caracteristica1Select = "";
  caracteristica2Select = "";
  caracteristica3Select = "";
  estado_to_id: any = {};
  listaProvincias: any = [];
  listaProvinciasFiltros: any = [];
  provinciaId: any = {};
  models: any = {};
  estadoSelect:number;
  provinciaSelect: string;
  noteForm:FormGroup;
  files:[] = [];
  fileEntries:number = 5;
  bucket:string;
  caracteristica1 = '';
  caracteristica2 = '';
  caracteristica3 = '';
  textCaract1 = false;
  textCaract2 = false;
  textCaract3 = false;
  dataFilter:any= [];
  page = 1;
  isDisabled = true;
  pageSize = 10;
  collectionSize:number = this.tempRow.length;

  flagEliminarPrroducto:string = '';
  configuraciones:any;

  constructor(private pedidosService: PedidosService,
    public translate: TranslateService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public configService: ConfigService,
  ){ 
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');
   
  }

  ngOnInit() {
    this.getConfig()
    this.getCaracteristica1();
    this.getCaracteristica2();
    this.getCaracteristica3();
    this.getProductosFaltantes();
    this.mostrarCaracteristicas();

    

  }

  getConfig(){
    this.configService.getConfigEmpresa({id:this.empresa.id}).then( (res:any) =>{    
      Swal.close();
      if(res.response.body['configuraciones'] != ""){
        this.bucket = res.response.body['bucket'];
        this.configuraciones = JSON.parse(res.response.body['configuraciones']);
        if(this.configuraciones["moneda"] == ""){
            this.configuraciones["moneda"] = "$";
        }
        this.caracteristica1 = this.configuraciones["caracteristica1"]['value']
        this.caracteristica2 = this.configuraciones["caracteristica2"]['value']
        this.caracteristica3 = this.configuraciones["caracteristica3"]['value']
      }
      
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  getFilesOrders(){

    this.pedidosService.getFileOrder({'npedido':this.empresa.pedido, 'token': this.empresa.id}).subscribe(
      (files) => {
        this.files = files;
      },
      (error) => {
        console.log(error);

      }
    )
  }

  getProductosFaltantes(){
    this.pedidosService.getProductosFaltantes(this.empresa).then( (res:any) =>{    
      console.log(res);
      res.productos.productos.forEach(element => this.models[element.id] = element.estado);

      if(res.productos.productos.length > 0){

        this.emptyTable = true;
        this.temp = res.productos.productos;
        this.tempRow = res.productos.productos;
        this.collectionSize = this.temp.length;
        this.refreshDatos();
        this.loadingIndicator = true;

      }else{
        this.emptyTable = false;

      }

    }).catch(err=>{
      console.log(err);
    });
  }

  refreshDatos() {
     if(this.dataFilter.length > 0){
      this.temp = this.dataFilter;
      this.temp = this.temp.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize,
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    }else{

      this.temp = this.tempRow.map(  (product, i) => ({id:i+1,...product})
                            ).slice(
                              (this.page - 1) * this.pageSize,
                              (this.page - 1) * this.pageSize + this.pageSize
                            );
    }

    console.log(this.temp);


  }

  formatN(num){
    num = num.toString();
    num = num.length<2?"0"+num:num;
    return num;
  }

  dates(op){
    var today = new Date();
    this.dateEnd = today.getFullYear()+"-"+this.formatN(today.getMonth()+1)+"-"+this.formatN(today.getDate());
    today.setDate(today.getDate()-op);
    this.dateStart = today.getFullYear()+"-"+this.formatN(today.getMonth()+1)+"-"+this.formatN(today.getDate());
    this.filters();this.notificationModal.hide();
  }

  filters(){
    
    const npedido = this.nroPedido;
    const nproveedor = this.nroProveedor;
    const caracteristica1 = this.caracteristica1Select;
    const caracteristica2 = this.caracteristica2Select;
    const caracteristica3 = this.caracteristica3Select;
    const star = this.dateStart;
    const end = this.dateEnd;
    const filtros = {
      caracteristica1: [caracteristica1, d => d['caracteristica1'].includes(caracteristica1)],
      caracteristica2: [caracteristica2, d => d['caracteristica2'].includes(caracteristica2)],
      caracteristica3: [caracteristica3, d => d['caracteristica3'].includes(caracteristica3)],
      id: [npedido, d => {
        let nroI = d['numero_interno'].toLowerCase();
        if(nroI.includes(npedido.toLocaleLowerCase()) ){
          return true;
        } 
      }],
      codigo_proveedor: [nproveedor, d => {
        let nroP = d['codigo_proveedor'];
        nroP = nroP!=null?nroP.toLowerCase():"";
        if(nroP.includes(nproveedor.toLocaleLowerCase()) ){
          return true;
        } 
      }],
      star: [star, d => {
        if(d['fecha'] >= star){
          return true;
        }
      }],
      end: [end, d => {

        if(star <= d['fecha'] && d['fecha'] <= end ){
          return true
        }
      }],
    }
    
    let producto1 = this.tempRow;
    console.log(producto1);  
    for (const filtro in filtros) {
      if(filtros[filtro][0]){
        producto1 = producto1.filter( filtros[filtro][1])   
      }
    }         
    if(producto1.length > 0){
      this.dataFilter = producto1;
      this.collectionSize = producto1.length;
      this.refreshDatos();
    }else{
      this.dataFilter = [];
      this.temp = [];
      this.collectionSize = 0;
    }


  }

  eliminar(){
    this.nroPedido = "";
    this.nroCliente = "";
    this.dateStart = null;
    this.dateEnd = null;
    this.temp = this.tempRow;
    this.dataFilter = [];
    this.estadoSelect=null;
    this.collectionSize = this.tempRow.length;
    this.provinciaSelect = null;
    this.refreshDatos();
  }
  dataExcelClientes(row){
    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadPedido?pedido="+row.id+"&token="+this.empresa.id, "_blank");
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  entriesChangeDet($event){
    this.entriesDet = $event.target.value;
  }
  filterTable(event) {
    const val = event.target.value.toLowerCase();
    
    if(val !== ''){
      this.temRow = this.temp.filter(function (d) {
      
        for (var key in d) {
          if(!Array.isArray(d[key])){      
            let hola = (d[key] != null) ? d[key].toLowerCase() : '';
            if ( hola.indexOf(val) !== -1) {
              return true;
            }      

          }  
        }
      });
      this.temp =this.temRow;
    }else{
      this.temp = this.tempRow;
    }    
  }

  onSelectItem(modalEditVendedor,row) {
    console.log(row);

    this.empresa.pedido = row.id;
    Swal.showLoading();
    this.flagEliminarPrroducto = row.estado;

    this.detalleId = row.numeroInterno;

    this.getDetallePedido();

    this.notificationModal = this.modalService.show(
      modalEditVendedor,
      this.notification
    );
    this.getFilesOrders();
  }

  getDetallePedido(){
    this.detalleRow = [];
    
    this.pedidosService.getDetalles(this.empresa).then( (res:any) =>{

      this.detalleSucursal = res.detalles.sucursal;
      
      this.detalleRow = res.detalles.detalle;
      this.tempRowDet = res.detalles.detalle;
      this.loadingIndicator = true;
      
      
      this.detalleRow.forEach(element => {
        element.cantidad_pedida = element.cantidad;
      });
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  exportarPedidos(){
    const endpoint = `${ConfigService.API_ENDPOINT()}Backend/exportarProductosFaltantes?
    nroPedido=${this.nroPedido}&dateStart=${this.dateStart}&dateEnd=${this.dateEnd}
    &token=${this.empresa.id}&caracteristica1=${this.caracteristica1}
    &caracteristica2=${this.caracteristica2}&caracteristica3=${this.caracteristica3}`;
    window.open(endpoint, '_blank');
  }

  mostrarMasFiltros(modalFiltros){
    this.notificationModal = this.modalService.show(
      modalFiltros,
      this.panelFiltro
    );
  }

  cambiarEstado(row,estado){
    row.estado = estado;
  }
  
  guardarArmado(){
    var flag = true;
    this.detalleRow.forEach(element => {
      if(element.estado!="1" && element.estado!="2"){
        flag = false;
      }
      element.fecha = new Date();
      element.usuario_id = localStorage.getItem('usuario');
    });
    if(!flag){
      Swal.fire('Error!','Hay productos que no estan marcados como armados ni faltantes', 'error');
    }else{
      this.pedidosService.armarPedido(this.detalleRow,this.empresa.id).subscribe( (res:any) =>{ 
        
        if(res){
          Swal.fire('Listo!','Pedido armado con éxito!', 'success')
          this.notificationModal.hide();
          this.getProductosFaltantes();
         }else{
          Swal.fire('Error!','El pedido no fue armado, intente nuevamente', 'error')
         }
      },(err)=>{
        Swal.close();
        console.log(err);
        Swal.fire('Error al armar el pedido, intente de nuevo!', 'error');
      });
    }
  }

  getCaracteristica1(){
    this.pedidosService.getCaracteristica(this.empresa, 1).then( (res:any) =>{
      
      res.caracteristica1.caracteristica1.forEach(element => {
        this.listaCaracteristica1.push(element.nombre);
      });
      console.log(this.listaCaracteristica1);
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  getCaracteristica2(){
    this.pedidosService.getCaracteristica(this.empresa, 2).then( (res:any) =>{
      
      res.caracteristica1.caracteristica1.forEach(element => {
        this.listaCaracteristica2.push(element.nombre);
      });
      console.log(this.listaCaracteristica1);
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }
  getCaracteristica3(){
    this.pedidosService.getCaracteristica(this.empresa, 3).then( (res:any) =>{
      
      res.caracteristica1.caracteristica1.forEach(element => {
        this.listaCaracteristica3.push(element.nombre);
      });
      console.log(this.listaCaracteristica1);
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  mostrarCaracteristicas(){
    this.textCaract1 = (this.configuraciones.caracteristica1 && this.configuraciones.caracteristica1.value && this.configuraciones.caracteristica1.value != "") ? this.configuraciones.caracteristica1.value : false;
    this.textCaract2 = (this.configuraciones.caracteristica2 && this.configuraciones.caracteristica2.value && this.configuraciones.caracteristica2.value != "") ? this.configuraciones.caracteristica2.value : false;
    this.textCaract3 = (this.configuraciones.caracteristica3 && this.configuraciones.caracteristica3.value && this.configuraciones.caracteristica3.value != "") ? this.configuraciones.caracteristica3.value : false;
  }
}

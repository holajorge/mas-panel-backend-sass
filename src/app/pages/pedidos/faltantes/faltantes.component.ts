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
  dateStar:any;
  dateEnd:any;
  lista_estados: any = [];
  lista_estadosFiltros: any = [];
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
    this.getProductosFaltantes();
    

    this.getConfig()

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
    this.dateStar = today.getFullYear()+"-"+this.formatN(today.getMonth()+1)+"-"+this.formatN(today.getDate());
    
  }

  filters(){
    
    const npedido = this.nroPedido;
    const ncliente = this.nroCliente;
    const star = this.dateStar;
    const end = this.dateEnd;
    const estado = this.estadoSelect;
    const provincia = this.provinciaSelect;
    
    const filtros = {
      estado: [estado, d => d['estado'].includes(estado)],
      provincia: [provincia, d => {
        
        if(d['provincia']==null)true
        else{
          let prov = d['provincia'].toLowerCase();
          if(prov.includes(provincia.toLocaleLowerCase()) ){
            return true;
          } 
        }
        
      }],
      id: [npedido, d => {
        let nroI = d['numeroInterno'].toLowerCase();
        if(nroI.includes(npedido.toLocaleLowerCase()) ){
          return true;
        } 
      }],
      nrocliente: [ncliente, d => {
        let nroC = d['nrocliente'].toLowerCase();
        if(nroC.includes(ncliente.toLocaleLowerCase()) ){
          return true;
        }
      }],
      star: [star, d => {
        if(d['fechafiltro'] >= star){
          return true;
        }
      }],
      end: [end, d => {

        if(star <= d['fechafiltro'] && d['fechafiltro'] <= end ){
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
    this.dateStar = null;
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
    window.open(ConfigService.API_ENDPOINT()+"Backend/exportarPedidos?nroPedido="+this.nroPedido+"&nroCliente="+this.nroCliente+
    "&dateStar="+this.dateStar+"&dateEnd="+this.dateEnd+"&estadoSelect="+this.estadoSelect+"&provinciaSelect="+this.provinciaSelect+"&token="+this.empresa.id, "_blank");  
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
        console.log(res);
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
}

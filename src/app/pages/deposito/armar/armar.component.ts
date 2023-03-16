import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/config/config.service';


@Component({
  selector: 'app-armar',
  templateUrl: './armar.component.html',
  styleUrls: ['./armar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArmarComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog2",
  };
  panelFiltro = {
    keyboard: true,
    class: "my-modal"
  }
  empresa:any = {id:'', pedido:''};
  temRow:any = [];
  temp = [];
  detalleRow = [];
  detalleSucursal;
  detalleId;
  tempRow = [];
  tempRow2 = [];
  tempRowDet:any = [];
  loadingIndicator = true; 
  emptyTable:boolean = false;
  dataExcel: any = [];
  nroPedido:string = "";
  cliente:string = "";
  codigoP:string = "";
  dateStar:any;
  dateEnd:any;
  lista_estados: any = [];
  listaEstadosProductos: any = [];
  lista_estadosFiltros: any = [];
  estado_to_id: any = {};
  estadoIdProductos: any = {};
  listaProvincias: any = [];
  listaProvinciasFiltros: any = [];
  provinciaId: any = {};
  models: any = {};
  estadoSelect:number;
  estadoSelectProductos:number;
  provinciaSelect: string;
  bucket:string;
  armados:boolean = false;
  dataFilter:any= [];
  page = 1;
  isDisabled = true;
  pageSize = 10;
  collectionSize:number = this.tempRow.length;

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
    this.lista_estados = [];
    this.listaEstadosProductos = ["Sin Armar","Armado","Faltante"];
    this.estadoIdProductos = {"Sin Armar":0,"Armado":1,"Faltante":2};
    this.lista_estadosFiltros = [];
    this.pedidosService.getDistinctEstadoPedidos(this.empresa).then( (res:any) =>{
      this.lista_estadosFiltros = res.resultado;
      res.resultado.forEach(element => {
        this.lista_estados.push(element.estado);
        this.estado_to_id[element.estado] = element.estado_id;
      });
      
      this.getPedidos();

    }).catch(err=>{
      console.log(err);
    });
    
    this.pedidosService.getDistinctProvinciaClientes(this.empresa).then( (res:any) =>{
      this.listaProvinciasFiltros = res.resultado;
      
      res.resultado.forEach(element => {
        this.listaProvincias.push(element.provincia);
      });


    }).catch(err=>{
      console.log(err);
    });

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

  getPedidos(){
    this.pedidosService.getPedidosCliente(this.empresa).then( (res:any) =>{    

      res.pedidos.pedidos.forEach(element => this.models[element.id] = element.estado);

      if(res.pedidos.pedidos.length > 0){

        this.emptyTable = true;
        this.temp = res.pedidos.pedidos;
        this.tempRow = res.pedidos.pedidos;
        this.collectionSize = this.temp.length;
        this.filters();
        this.refreshDatos();
        this.loadingIndicator = true;
        this.dataExcel = res.pedidos.detalle;

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
  }

  formatN(num){
    return (num = num.toString().length < 2 ? "0" + num : num);
  }

  dates(op) {
    var today = new Date();
    var month = this.formatN(today.getMonth() + 1);
    var day = this.formatN(today.getDate());
    this.dateEnd = today.getFullYear() + "-" + month + "-" + day;
    today.setDate(today.getDate() - op);
    this.dateStar = today.getFullYear() + "-" + month + "-" + day;
    this.filters();
    this.notificationModal.hide();
  }

  filters(){
    const npedido = this.nroPedido;
    const ncliente = this.cliente;
    const star = this.dateStar;
    const end = this.dateEnd;
    const estado = this.estadoSelect;
    const provincia = this.provinciaSelect;
    
    const filtros = {
      estado: [estado, d => (d['estado']==estado)],
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
        let nroC = d['cliente'].toLowerCase();
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
    //console.log(producto1);  
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
    this.cliente = "";
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

  onSelectItem(modalEditVendedor,row, modificar) {
   // console.log(row);
    
    if(modificar){
     this.change_state(row);
    }
    this.empresa.pedido = row.id;
    Swal.showLoading();

    this.detalleId = row.numeroInterno;

    this.getDetallePedido();

    this.notificationModal = this.modalService.show(
      modalEditVendedor,
      this.notification
    );
  }

  getDetallePedido(){
    this.detalleRow = [];
    
    this.pedidosService.getDetalles(this.empresa).then( (res:any) =>{

      this.detalleSucursal = res.detalles.sucursal;
      
      this.detalleRow = res.detalles.detalle;
      this.detalleRow.forEach(element => {
        element.cantidad_pedida = element.cantidad;
        element.estado = 0;
      });
      this.tempRowDet = res.detalles.detalle;
      this.loadingIndicator = true;
      
      
      
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  exportarPedidos(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/exportarPedidos?nroPedido="+this.nroPedido+"&flag=1&nroCliente="+this.cliente+
    "&dateStar="+this.dateStar+"&dateEnd="+this.dateEnd+"&estadoSelect="+this.estadoSelect+"&provinciaSelect="+this.provinciaSelect+"&token="+this.empresa.id, "_blank");  
  }

  mostrarMasFiltros(modalFiltros){
    this.notificationModal = this.modalService.show(
      modalFiltros,
      this.panelFiltro
    );
  }

  cambiarEstado(row,estado){
    if(estado==2){
      row.cantidad = 0;
    }else{
      row.cantidad = row.cantidad_pedida;
    }
    row.estado = estado;
  }
  
  guardarArmado(){
    var flag = true;
    this.detalleRow.forEach(element => {
      if(element.estado!="1" && element.estado!="2"){
        flag = false;
      }
      delete element.ubicacion;
      element.fecha = new Date();
      element.usuario_id = localStorage.getItem('usuario');
    });
    if(!flag){
      Swal.fire('Error!','Hay productos que no estan marcados como armados ni faltantes', 'error');
    }else{
      this.pedidosService.armarPedido(this.detalleRow,this.empresa.id).subscribe( (res:any) =>{ 
       // console.log(res);
        if(res){
          Swal.fire('Listo!','Pedido armado con éxito!', 'success')
          this.notificationModal.hide();
          this.getPedidos();
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

  filters2() {
    const codigo = this.codigoP;
    const estado = this.estadoSelectProductos;
    let producto1 = this.detalleRow;
    if (codigo) {
      producto1 = producto1.filter((d) => d["codigo"].includes(codigo));
    }
    if (estado) {
      producto1 = producto1.filter((d) => d["estado"] == this.estadoIdProductos[estado]);
    }
  
    this.tempRowDet = producto1.length > 0 ? producto1 : [];
  }

  change_state(row){
    if(this.models[row.id] == null){
        this.models[row.id] = row["estado"];
        return;
    }
    let estado = row["estado"];
    row["estado"] = "En Armado";
    row["pedido_estado_id"] = 6;

    this.pedidosService.updateEstadoPedido(row).then( (res:any) =>{
      if(res.resultado == true){
        this.getPedidos();
       }else{
        this.models[row.id] = estado;
        row["estado"] = estado;
        
       }
    }).catch(err=>{
      console.log(err);
    });
  }
}

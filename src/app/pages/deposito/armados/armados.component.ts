import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/config/config.service';
import { element } from 'protractor';
@Component({
  selector: 'app-armados',
  templateUrl: './armados.component.html',
  styleUrls: ['./armados.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArmadosComponent implements OnInit {
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
  conFaltante = new Set();
  codigoP:string = "";
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
    this.addForm = this.formBuilder.group({
      pedido_id: ['', Validators.required],
      comentario: ['', Validators.required],
    });

    this.noteForm = this.formBuilder.group({
      pedido_id: ['', Validators.required],
      notas: ['', Validators.required],
    });
    
    this.lista_estados = [];
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

  getPedidos(){
    this.pedidosService.getPedidosClienteEstado(this.empresa,"Armado").then( (res:any) =>{    

      res.pedidos.pedidos.forEach(element => {
          this.models[element.id] = element.estado;
          if(element.faltantes==2){
            this.conFaltante.add(element.numeroInterno);
          }
        }
      );
      
      

      if(res.pedidos.pedidos.length > 0){

        this.emptyTable = true;
        this.temp = res.pedidos.pedidos;
        this.temp = this.temp.filter(ele => !(this.conFaltante.has(ele.numeroInterno) &&
        ele.faltantes==1));
        this.tempRow = this.temp;
        this.collectionSize = this.temp.length;
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
    num = num.toString();
    num = num.length<2?"0"+num:num;
    return num;
  }

  dates(op){
    var today = new Date();
    this.dateEnd = today.getFullYear()+"-"+this.formatN(today.getMonth()+1)+"-"+this.formatN(today.getDate())
    today.setDate(today.getDate()-op);
    this.dateStar = today.getFullYear()+"-"+this.formatN(today.getMonth()+1)+"-"+this.formatN(today.getDate());
    this.filters();this.notificationModal.hide();
  }

  filters() {
    const npedido = this.nroPedido;
    const ncliente = this.nroCliente;
    const star = this.dateStar;
    const end = this.dateEnd;
    const provincia = this.provinciaSelect;
    
    let producto1 = this.tempRow;
  
    if (provincia) {
      producto1 = producto1.filter(d => {
        if (!d['provincia']) {
          return true;
        } else {
          let prov = d['provincia'].toLowerCase();
          return prov.includes(provincia.toLocaleLowerCase());
        }
      });
    }
    
    if (npedido) {
      producto1 = producto1.filter(d => {
        let nroI = d['numeroInterno'].toLowerCase();
        return nroI.includes(npedido.toLocaleLowerCase());
      });
    }
    
    if (ncliente) {
      producto1 = producto1.filter(d => {
        let nroC = d['cliente'].toLowerCase();
        return nroC.includes(ncliente.toLocaleLowerCase());
      });
    }
    
    if (star) {
      producto1 = producto1.filter(d => d['fechafiltro'] >= star);
    }
    
    if (end) {
      producto1 = producto1.filter(d => {
        if (star <= d['fechafiltro'] && d['fechafiltro'] <= end) {
          return true;
        }
      });
    }
  
    if (producto1.length > 0) {
      this.dataFilter = producto1;
      this.collectionSize = producto1.length;
      this.refreshDatos();
    } else {
      this.dataFilter = [];
      this.temp = [];
      this.collectionSize = 0;
    }
  }
  
  dataExcelClientes(row){
    const endpoint = ConfigService.API_ENDPOINT() + "Backend/downloadPedido";
    const params = "?pedido=" + row.id + "&token=" + this.empresa.id;
    window.open(endpoint + params, "_blank");
  }

  exportarPedidos(){
    const endpoint = ConfigService.API_ENDPOINT() + "Backend/exportarPedidos";
    const params = "?nroPedido=" + this.nroPedido + 
                  "&flag=1" +
                  "&nroCliente=" + this.nroCliente +
                  "&dateStar=" + this.dateStar + 
                  "&dateEnd=" + this.dateEnd + 
                  "&estadoSelect=Armado" + 
                  "&provinciaSelect=" + this.provinciaSelect + 
                  "&token=" + this.empresa.id;
    window.open(endpoint + params, "_blank");  
  }

  mostrarMasFiltros(modalFiltros){
    this.notificationModal = this.modalService.show(
      modalFiltros,
      this.panelFiltro
    );
  }

  getDetallePedido(){
    this.detalleRow = [];
    
    this.pedidosService.getDetallepedidoFaltantes(this.empresa).then( (res:any) =>{
      this.detalleRow = res.detalles;
      this.tempRowDet = res.detalles;
      this.loadingIndicator = true;
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  getFaltantes(modalEditVendedor,row){
    this.empresa.pedido = row.id;
    Swal.showLoading();

    this.detalleId = row.numeroInterno;

    this.getDetallePedido();

    this.notificationModal = this.modalService.show(
      modalEditVendedor,
      this.notification
    );
  }

  filters2() {
    const codigo = this.codigoP;
    let producto1 = this.detalleRow;
    if (codigo) {
      producto1 = producto1.filter((d) => d["codigo"].includes(codigo));
    }
    this.tempRowDet = producto1.length > 0 ? producto1 : [];
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
}

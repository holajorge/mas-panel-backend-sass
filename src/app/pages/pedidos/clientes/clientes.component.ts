import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PedidosService } from '../../../service/pedidos/pedidos.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/service/config/config.service';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientesComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static",
  };
  panelFiltro = {
    keyboard: true,
    class: "my-modal"
  }
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
  nroVendedor:string = "";
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

  listaEstados:[] = []; 

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
    

    this.pedidosService.getPedidosCliente(this.empresa).then( (res:any) =>{    

      res.pedidos.pedidos.forEach(element => this.models[element.id] = element.estado);

      if(res.pedidos.pedidos.length > 0){

        this.emptyTable = true;
        this.temp = res.pedidos.pedidos;
        this.tempRow = res.pedidos.pedidos;
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
    // this.rows = this.rowsTemp;
    // console.log(this.rows);
    
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

   // console.log(this.temp);


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
    console.log(this.dateEnd);
    this.dateStar = today.getFullYear()+"-"+this.formatN(today.getMonth()+1)+"-"+this.formatN(today.getDate());
    this.filters();this.notificationModal.hide();
  }

  filters(){
    
    const npedido = this.nroPedido;
    const ncliente = this.nroCliente;
    const nvendedor = this.nroVendedor;
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
      nvendedor: [nvendedor, d => {
        if(d['vendedor_id']){
          let nroV = d['vendedor_id'].toLowerCase();
          if(nroV.includes(nvendedor.toLocaleLowerCase()) ){
            return true;
          }
        }else{
          return false;
        }
        
      }],
      star: [star, d => {
        if(d['fechafiltro'] >= star){
          return true;
        }
        // d['fechafiltro'].includes(star)
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

    // this.temp = producto1;

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
      // filter our data
      this.temRow = this.temp.filter(function (d) {
      
        for (var key in d) {
          if(!Array.isArray(d[key])){      
            let hola = (d[key] != null) ? d[key].toLowerCase() : '';
            if ( hola.indexOf(val) !== -1) {
              return true;
            }      

          }  
        }
        // return false;
      });
      this.temp =this.temRow;
    }else{
      this.temp = this.tempRow;
    }    
  }
  filterTableDet(event){
    const val = event.target.value.toLowerCase();
    
    
    if(val.length > 0){    
      
      this.detalleRow = this.tempRowDet;
      let temRowDet = this.detalleRow.filter(function (item) {          
        for (var key in item) {     
                    
          let hola = (item[key] != '' && item[key] != null) ? item[key].toLowerCase() : '';          
          if ( hola.indexOf(val) !== -1) {
            return true;
          }
        }   
      });
     
      this.detalleRow = temRowDet;
      
    }else{
      this.detalleRow = this.tempRowDet;
    }
  }

  get pedidoRecibido(){
    return (this.flagEliminarPrroducto == 'Recibido') ? true : false;
  }
  onSelectItem(modalEditVendedor,row) {
   // console.log(row);

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

      console.log(res, 'aaaaaa'); 

      this.detalleSucursal = res.detalles.sucursal || [];
      this.detalleRow = res.detalles.detalle || [];
      this.tempRowDet = res.detalles.detalle || [];
      this.listaEstados = res.estados || [];

      this.loadingIndicator = true;

      this.detalleRow.forEach((row) => {
        if("variaciones" in row && row["variaciones"]){
            row["cantidad"] = "";
            row["variaciones"].forEach((variacion) => {
                row["cantidad"] += variacion.cantidad.toString() + " x ";
                variacion.attributes.forEach((attr) => {
                    row["cantidad"] += "<strong>" + attr[0] + ": </strong>" + attr[1] + " / ";
                })
                row["cantidad"] = row["cantidad"].substring(0, row["cantidad"].length - 3) + "<br>";

            })
        }
      })

      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  eliminarProductoPedido(producto){

    Swal.fire({
      title: 'Seguro de Eliminar?',
      text: "Eliminar el producto de este pedido!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, Eliminar!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {

      if (result.value) {

        setTimeout( ()=>{
          this.eliminarProductoSave(producto);
        },1000);

      }
    })

  }

  eliminarProductoSave(producto){
    Swal.showLoading();
    this.pedidosService.eliminarProductoPedido(producto, this.empresa.id).subscribe( (res:any) =>{
      Swal.close();
      if(res){
        Swal.fire('Listo!','Producto eliminado con éxito!', 'success');
        this.getDetallePedido();

      }else{
        Swal.fire('Error al eliminar el producto, intente de nuevo!', 'error');
      }
    },
    (err)=>{
      Swal.close();
      console.log(err);
      Swal.fire('Error al eliminar el producto, intente de nuevo!', 'error');

    });
  }
  onaddComente(modalComent,row){
    
    this.addForm.setValue({pedido_id: row.id,comentario:row.comentario});
    this.btnvisibility = false;
    this.notificationModal = this.modalService.show(
      modalComent,
      this.notification
    );
  }
  addNote(modalNote,row){
    console.log(row);
    if(row.notas){
      this.noteForm.patchValue({notas:row.notas});
    }
    this.noteForm.patchValue({pedido_id: row.id});
    
    // this.btnvisibility = false;
    this.notificationModal = this.modalService.show(
      modalNote,
      this.notification
    );
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  onActivateDet(event) {
    this.activeRowDet = event.row;
  }
  guardarComentarioPedido(){

    this.pedidosService.getGuardarComentario(this.addForm.value).then( (res:any) =>{    
      console.log(res);
      if(res.resultado == true){
        Swal.fire('Listo!','Comentario agregado con éxito!', 'success')
        this.notificationModal.hide();
        this.getPedidos();
       }else{
        Swal.fire('Error!','El comentario no fué guardado intente nuevamente', 'error')
       }
    }).catch(err=>{
      console.log(err);
    });
  }
  guardarNotaPedido(){
    this.pedidosService.getGuardarNota(this.noteForm.value).then( (res:any) =>{    
      console.log(res);
      if(res.resultado == true){
        Swal.fire('Listo!','Nota agregada con éxito!', 'success')
        this.notificationModal.hide();
        this.noteForm.reset();
        this.getPedidos();
       }else{
        Swal.fire('Error!','La nota no fué guardada intente nuevamente', 'error')
       }
    }).catch(err=>{
      console.log(err);
    });
  }

  change_state(row){
   
    if(this.models[row.id] == null){
        this.models[row.id] = row["estado"];
        return;
    }
    let estado = row["estado"];
    row["estado"] = this.models[row.id];
    row["pedido_estado_id"] = this.estado_to_id[row["estado"]];

    this.pedidosService.updateEstadoPedido(row).then( (res:any) =>{
      if(res.resultado == true){
        Swal.fire('Listo!','Estado modificado con éxito!', 'success');
        this.getPedidos();
       }else{
        this.models[row.id] = estado;
        row["estado"] = estado;
        Swal.fire('Error!','El estado no fue modificado, intente nuevamente', 'error');
       }
    }).catch(err=>{
      console.log(err);
    });
  }

  exportarPedidos(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/exportarPedidos?nroPedido="+this.nroPedido+"&flag=0&nroCliente="+this.nroCliente+
    "&dateStar="+this.dateStar+"&dateEnd="+this.dateEnd+"&estadoSelect="+this.estadoSelect+"&provinciaSelect="+this.provinciaSelect+"&token="+this.empresa.id, "_blank");  
  }

  mostrarMasFiltros(modalFiltros){
    this.notificationModal = this.modalService.show(
      modalFiltros,
      this.panelFiltro
    );
  }

  modificarProductoPedido(producto){
    Swal.showLoading();
    this.pedidosService.editarProductoPedido(producto, this.empresa.id).subscribe( (res:any) =>{
      Swal.close();
      if(res){
        Swal.fire('Listo!','Producto eliminado con éxito!', 'success');
        this.getDetallePedido();
        this.getPedidos();
      }else{
        Swal.fire('Error al eliminar el producto, intente de nuevo!', 'error');
      }
    },
    (err)=>{
      Swal.close();
      console.log(err);
      Swal.fire('Error al eliminar el producto, intente de nuevo!', 'error');

    });

  }

  esTexto(txt){

    if(isNaN(txt)){
      return true;
    }
    else{
      return false;
    }
  }

}

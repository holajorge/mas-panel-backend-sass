import {Component, ViewChild, OnInit, ElementRef, Renderer2} from '@angular/core';
import {PedidosService } from '../../service/pedidos/pedidos.service';
import {ClienteService } from '../../service/cliente/cliente.service';
import {TranslateService} from '@ngx-translate/core';
import { ConfigService } from 'src/app/service/config/config.service';

import {
    NgbDatepicker,
    NgbInputDatepicker,
    NgbDateStruct,
    NgbCalendar,
    NgbDateAdapter,
    NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgModel} from "@angular/forms";
import {Subscription} from 'rxjs';

import Chart from "chart.js";


const now = new Date();
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  empresa:any = {id:'', pedido:''};
  pedidos_count = 0;
  clientes_count = 0;
  price_total = 0;

  // range date selector
  startDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;
  hoveredDate: NgbDateStruct;
  fromDate: any;
  toDate: any;
  model: any;
  private _subscription: Subscription;
  private _selectSubscription: Subscription;
  @ViewChild("d") input: NgbInputDatepicker;
  @ViewChild(NgModel) datePick: NgModel;
  @ViewChild('myRangeInput') myRangeInput: ElementRef;

  isHovered = date =>
  this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate)
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);


  // charts
  pedidos_chart_data: any;

  // datatables
  productsDatatableEmpty:boolean = true;
  loadingIndicatorProductsDatatable = true;
  clientsDatatableEmpty:boolean = true;
  colorsDatatableHydroEmpty:boolean = false;
  clientsDatatableHydroEmpty:boolean = false;
  tratamientoDatatableHydroEmpty:boolean = false;
  loadingIndicatorClientsDatatable = true;
  datatableClientes = [];
  datatableProductos = [];
  columnsProducts = [];
  columnsClients = [];
  columnsColorsHydro = [];
  columnsClientsHydro = [];
  columnsTratamientoHydro = [];

  // custom para hydro
  data_hydro = {'result': false, 'data': []};

  constructor(
    public translate: TranslateService,
    private pedidosService: PedidosService,
    private clienteService: ClienteService,
    element: ElementRef, private renderer: Renderer2, private _parserFormatter: NgbDateParserFormatter,
    public configService: ConfigService,
  ) {
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');
    this.getPedidos();
    this.getClientes();
    this.getDataHydro();
  }

  ngOnInit() {
    setTimeout(this.initRangeSelector, 1000, this);
    this.columnsProducts = [
       { name: 'TITULO', prop: 'titulo', resizeable: true},
       { name: 'CANTIDAD', prop: 'cantidad', resizeable: true, width: 110, minWidth: 110, maxWidth: 110 }
    ];
    this.columnsClients = [
       { name: 'CLIENTE', prop: 'cliente', resizeable: true},
       { name: 'VENTAS', prop: 'ventas', resizeable: true, width: 110, minWidth: 110, maxWidth: 110 }
    ];
    this.columnsColorsHydro = [
       { name: 'Color', prop: 'color', resizeable: true},
       { name: 'Cantidad de Kilos', prop: 'kilos', resizeable: true}
    ];
    this.columnsClientsHydro = [
       { name: 'Cliente', prop: 'cliente', resizeable: true},
       { name: 'Cantidad de pedidos', prop: 'pedidos', resizeable: true}
    ];
    this.columnsTratamientoHydro = [
       { name: 'Tratamiento', prop: 'tratamiento', resizeable: true},
       { name: 'Cantidad de pedidos', prop: 'pedidos', resizeable: true}
    ];

  }

  initRangeSelector(that){

    that.startDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    that.maxDate = { year: now.getFullYear() + 1, month: now.getMonth() + 1, day: now.getDate()};
    that.minDate = {year: now.getFullYear() - 10, month: now.getMonth() + 1, day: now.getDate()};

    that.toDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};

    let dt = new Date();
    dt.setDate( dt.getDate() - 10 );
    that.fromDate = {year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate()};


    let parsed = '';
    parsed += that._parserFormatter.format(that.fromDate);
    parsed += ' - ' + that._parserFormatter.format(that.toDate);
    //parsed = parsed.substring(1)
    that.renderer.setProperty(that.myRangeInput.nativeElement, 'value', parsed);
    that.requestDataFromRange();
  }

  getPedidos(){
    this.price_total = 0;
    this.pedidos_count = 0;
    this.empresa.pedido = "";
    this.pedidosService.getPedidosyDetallesCliente(this.empresa).then( (res:any) =>{
      this.pedidos_count = res.pedidos["pedidos"].length;
      res.pedidos['pedidos'].forEach(element => {
        this.price_total += parseFloat(element.precio) * parseInt(element.cantidad);
      });
    }).catch(err=>{
      console.log(err);
    });
  }

  getClientes(){
    this.clientes_count = 0;
    this.clienteService.getcliente(this.empresa).then( (res:any) =>{
      this.clientes_count = res.pedidos['clientes'].length;
    }).catch(err=>{
      console.log(err);
    });
  }

  getDataHydro(){
    if(this.fromDate && this.toDate){
        let start_date = this.fromDate["year"] + "-" + this.fromDate["month"] + "-" + this.fromDate["day"];
        let end_date = this.toDate["year"] + "-" + this.toDate["month"] + "-" + this.toDate["day"];
        this.data_hydro = {'result': false, 'data': []};
        this.pedidos_count = 0;
        this.empresa.pedido = "";
        this.pedidosService.getDataHydro(this.empresa, start_date, end_date).then( (res:any) =>{

          // Por default ordeno los 3 arrays de mayor a menor
          res.pedidos.data['kilos_por_color'].sort((a, b) => {
              if (a.kilos > b.kilos) return -1;
              if (a.kilos < b.kilos) return 1;
              return 0;
          })
          res.pedidos.data['pedidos_por_tratamiento'].sort((a, b) => {
              if (a.pedidos > b.pedidos) return -1;
              if (a.pedidos < b.pedidos) return 1;
              return 0;
          })
          res.pedidos.data['pedidos_por_cliente'].sort((a, b) => {
              if (a.pedidos > b.pedidos) return -1;
              if (a.pedidos < b.pedidos) return 1;
              return 0;
          })

          this.data_hydro = res.pedidos;
          if(this.data_hydro.data['kilos_por_color'].length > 0){
            this.colorsDatatableHydroEmpty = false;
          }else{
            this.colorsDatatableHydroEmpty = true;
          }
          if(this.data_hydro.data['pedidos_por_tratamiento'].length > 0){
            this.tratamientoDatatableHydroEmpty = false;
          }else{
            this.tratamientoDatatableHydroEmpty = true;
          }
          if(this.data_hydro.data['pedidos_por_cliente'].length > 0){
            this.clientsDatatableHydroEmpty = false;
          }else{
            this.clientsDatatableHydroEmpty = true;
          }
        }).catch(err=>{
          console.log(err);
        });
    }
  }

  onDateSelection(date: NgbDateStruct) {

    let parsed = '';
    if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
        this.toDate = date;
        // this.model = `${this.fromDate.year} - ${this.toDate.year}`;
        this.input.close();
    } else {
        this.toDate = null;
        this.fromDate = date;
    }
    if(this.fromDate) {
      parsed += this._parserFormatter.format(this.fromDate);
    }
    if(this.toDate) {
      parsed += ' - ' + this._parserFormatter.format(this.toDate);
    }
    this.requestDataFromRange();
    this.renderer.setProperty(this.myRangeInput.nativeElement, 'value', parsed);
  }

  requestDataFromRange(){
    if(this.fromDate && this.toDate){
        let start_date = this.fromDate["year"] + "-" + this.fromDate["month"] + "-" + this.fromDate["day"];
        let end_date = this.toDate["year"] + "-" + this.toDate["month"] + "-" + this.toDate["day"];
        this.getDataHydro();
        this.pedidosService.getPedidosClientePorFechas(this.empresa, start_date, end_date).then( (res:any) =>{
          this.plotLineChart(res.pedidos["pedidos"]);
        }).catch(err=>{
          console.log(err);
        });

        this.pedidosService.getDatatablesFromRange(this.empresa, start_date, end_date).then( (res:any) =>{
          if(res.pedidos.clientes.length > 0){
            this.clientsDatatableEmpty = false;
            this.datatableClientes = res.pedidos.clientes.slice(0, 15);
            this.loadingIndicatorClientsDatatable = true;
          }else{
            this.clientsDatatableEmpty = true;
         }

          if(res.pedidos.productos.length > 0){
            this.productsDatatableEmpty = false;
            this.datatableProductos= res.pedidos.productos.slice(0, 15);
            this.loadingIndicatorProductsDatatable = true;
          }else{
            this.productsDatatableEmpty = true;
         }


        }).catch(err=>{
          console.log(err);
        });

    }
  }

  plotLineChart(data_pedidos){

    var chartSales = document.getElementById("chart-sales");

    let data = {
      options: {
        scales: {
          yAxes: [
            {
              gridLines: {
                color: "#e9ecef",
                zeroLineColor: "#e9ecef"
              },
              ticks: {}
            }
          ],
          xAxes: [{
            type: 'time',
            time: {
                unit: 'day'
            }
          }]

        }
      },
      data: {
        datasets: [
          {
            label: "Pedidos Recibidos",
            data: data_pedidos
          }
        ],
        label: "Pedidos"
      }
    };

    // Init chart
    var salesChart = new Chart(chartSales, {
      type: "line",
      data: data.data,
      options: data.options
    });

  }

  dataExcelKilosPorColor(){
    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadTableHydro?token="+this.empresa.id, "_blank");
  }
  dataExcelHydro(table){
    window.open(ConfigService.API_ENDPOINT()+"Backend/downloadTableHydro?token="+this.empresa.id+"&table="+table, "_blank");
  }
}

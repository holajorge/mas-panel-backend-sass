import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/service/config/config.service';
import { PaymentsService } from 'src/app/service/payments/payments.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static",
  };

  empresa:any = {id:''};
  pais:any = 2; // chile
  lista_no_configurados:any = [];
  lista_configurados:any = [];
  flagEdit:any = false;
  payment_selected:any = {};
  configuration:any = {};


  constructor(private paymentsService:PaymentsService, private modalService: BsModalService) {
    this.empresa.id = localStorage.getItem('usuario');
    this.getPayments();
  }

  ngOnInit() {
    this.configuration = {mercadopago: {publicKey: "", accessToken: ""}, webpay: {ecommerceCode: "", secretApiKey: ""}};
  }

  getPayments(){
    Swal.showLoading();
    this.paymentsService.getPaymentsList(this.empresa, this.pais).then( (res:any) =>{
      this.lista_configurados = res["list"]["configurados"];
      let aux = this.lista_configurados.map(function(configurado){
        if(configurado){
            return configurado.id;
        }
      });
      this.lista_no_configurados = res["list"]["lista"].filter(function(list) {
            if(!aux.includes(list.id)){
                return true;
            }else{
                return false;
            }
      });
      Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  configurar(modalEdit, payment, editar=false) {
    this.flagEdit = false;
    this.payment_selected = payment;
    if(editar){
        this.flagEdit = true;
        if(this.payment_selected.nombre == 'WebPay'){
            this.configuration["webpay"] = payment["configuration"];
        }
        if(this.payment_selected.nombre == 'MercadoPago'){
            this.configuration["mercadopago"] = payment["configuration"];
        }
    }else{
        this.payment_selected.active = false;
        this.configuration = {mercadopago: {publicKey: "", accessToken: ""}, webpay: {ecommerceCode: "", secretApiKey: ""}};
    }
    this.notificationModal = this.modalService.show(
      modalEdit,
      this.notification
    );
  }

  saveConfigGateway(){
    let data = JSON.parse(JSON.stringify(this.payment_selected));
    if(this.payment_selected.nombre == 'WebPay'){
        data["configuration"] = this.configuration["webpay"];
    }
    if(this.payment_selected.nombre == 'MercadoPago'){
        data["configuration"] = this.configuration["mercadopago"];
    }
    Swal.showLoading();
    this.paymentsService.saveConfigurationGateway(this.empresa, data).then( (res:any) =>{
        this.getPayments();
        Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });

  }

  activar(payment){
    Swal.showLoading();
    this.paymentsService.activateConfigurationGateway(this.empresa, payment).then( (res:any) =>{
        this.getPayments();
        Swal.close();
    }).catch(err=>{
      console.log(err);
    });
  }

  desactivar(payment){
    Swal.showLoading();
    this.paymentsService.desactivateConfigurationGateway(this.empresa, payment).then( (res:any) =>{
        this.getPayments();
        Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }

  eliminar(payment){
    Swal.showLoading();
    this.paymentsService.removeConfigurationGateway(this.empresa, payment).then( (res:any) =>{
        this.getPayments();
        Swal.close();
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });
  }


}

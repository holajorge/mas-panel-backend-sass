import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';//importar para formular envio de todos los parametros
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { ConfigService } from 'src/app/service/config/config.service';

@Component({
  selector: 'app-micuenta',
  templateUrl: './micuenta.component.html',
  styles: []
})
export class MicuentaComponent implements OnInit {
  addForm: FormGroup;
  newFormVendedor: FormGroup;
  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl static", 
  };
  empresa:any = {id:''}; 
  empresaData:any;
  // lastpassword:String = "";
  flag:boolean = true;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder, 
    public translate: TranslateService,
    public configService: ConfigService
  ) { 
    this.translate.use('es');
    this.empresa.id = localStorage.getItem('usuario');

    this.addForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmpassword: [null, Validators.required],
      empresa: [null],
      lastpassword: [null]
    });
  }

  ngOnInit() {
    
    this.getConfig();
   
  }
  getConfig(){
    Swal.showLoading();
    this.configService.getConfigEmpresa(this.empresa).then( (res:any) =>{    
      console.log(res.response['body']['empresa']);
      this.empresaData = res.response['body']['empresa'];

      this.addForm.patchValue({
        email: this.empresaData.email,
        empresa: this.empresa.id
      })
      Swal.close();
    });
  }
  comprobarPassword(event:any){
    console.log(event.target.value);

    const antes = event.target.value;
    if(antes == this.empresaData.clave){
      this.flag = false;
    }else{
        this.flag = true;
    }
  }

  confirmPasswordNew(event:any){

    const confirm = event.target.value;
    console.log(confirm);
    if(confirm === this.addForm.get('password').value){
      console.log('si');

      this.addForm.patchValue({
        confirmpassword: confirm
      });
    }else{
      console.log('no');

      this.addForm.patchValue({
        confirmpassword: null 
      });
    }
  }
  registrarData(){
    Swal.showLoading();
    
    this.configService.saveData(this.addForm.value).then( (res:any) =>{

      console.log(res);
      if(res.response['body'].flag == true){
        Swal.fire('Listo!','configuración guardada con exito!', 'success');
        this.getConfig();
        this.addForm.reset();
      }else{
        Swal.fire('Error al guardar, intente de nuevo!', 'error')
      }
      
      
    }).catch(err=>{
      Swal.close();
      console.log(err);
    });

  }
  solicitarBaja(){

    Swal.fire({
      title: '¿Seguro de solicitar la baja?',
      text: "Se dará de baja la cuenta!",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'si, estoy seguro!',
      cancelButtonClass: 'btn btn-secondary'
    }).then((result) => {
        if (result.value) {
          Swal.showLoading();

          this.configService.darBaja(this.empresa).then( (res:any) =>{

            console.log(res);
            if(res.response['body'].flag == true){
              Swal.fire('Listo!','Baja solicitada con éxito!', 'success');
              this.getConfig();
              // this.addForm.reset();
            }else{
              Swal.fire('Error al guardar, intente de nuevo!', 'error')
            }
            
            
          }).catch(err=>{
            Swal.close();
            console.log(err);
          });
        }
    })

  }
}

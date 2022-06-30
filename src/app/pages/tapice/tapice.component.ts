import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';
import { TapiceService } from '../../service/tapice/tapice.service';

@Component({
  selector: 'app-tapice',
  templateUrl: './tapice.component.html',
  styleUrls: ['./tapice.component.scss']
})
export class TapiceComponent implements OnInit {
  fileForm: FormGroup;
  file_data:any = [];

  constructor(private formBuilder: FormBuilder, public onboardingService:WalkthroughService, 
    private tapiceService: TapiceService) { }

  ngOnInit() {
    this.fileForm = this.formBuilder.group({
      file: [''],
      filesource: ['',Validators.required]
    });
  }
  handleFile(event) {

    const files:FileList = event.target.files;
    if(files.length > 0){
      const file = files[0];
      if((file.size/1048576)<=4){
        let formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('token',localStorage.getItem('usuario'));
        this.file_data=formData;
        this.fileForm.patchValue({filesource: files});
      }else{
        Swal.fire('Error al importar al archivo excede o limite de tamaño permitido, intente de nuevo!', 'error')
      }
    }    
  }
  showMessage(){
    
    Swal.fire({
      // icon: "warning",
      title: "Remplazar productos",
      // text: "Cantidad productos eliminados: "+ 40 +"<br>" + "productos Nuevos:" + 50, 
      html: '<h2>Esta acción remplazará todos los producto por los que contiene el archivo .csv</h2>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Deshacer'
    }).then((result) => {
     
      let resul = result;
      if (resul.value) {
        setTimeout( ()=> {
          this.sendFile();
        }, 2000)
        
      }
      if(resul.dismiss){        
        this.fileForm.reset();
      }

    });       
  }
  sendFile(){
    Swal.showLoading()

    this.tapiceService.importCSVTapice(this.file_data).subscribe(
      (resp)=> {

        Swal.close();
        Swal.fire(resp.msg,'', resp.flag);
        
        this.fileForm.reset();
      },
      error => {
        Swal.close()
        console.log(error);
        Swal.fire('error','error de comunicacion, intente nuevamente','error');

        this.fileForm.reset();
      }
      
    )

  }


}

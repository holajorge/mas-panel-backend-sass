import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { BdcWalkService } from 'bdc-walkthrough';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WalkthroughService {
  constructor(private bdcWalkService: BdcWalkService) { }
  on = false;
  id = 'taskWelcome';
  componentSubscription: Subscription;

  tasks = [
    {name: 'taskWelcome', title: 'Bienvenido', done: false},
    {name: 'taskClickProducts', title: 'Click en menu de navegación productos', done: false},
    {name: 'chooseOption', title: 'Elige una opción', done: false}
  ];

  turn_on(){
    this.on = true;
    this.tasks = [
        {name: 'taskWelcome', title: 'Bienvenido', done: false},
        {name: 'taskClickProducts', title: 'Click en menu de navegación productos', done: false},
        {name: 'chooseOption', title: 'Elige una opción', done: false}
    ];
    this.componentSubscription = this.bdcWalkService.changes.subscribe(() => {
        this.onTaskChanges();
    });
  }

  turn_off(){
    if(this.on){
        this.componentSubscription.unsubscribe();
    }
    this.on = false;
  }

  submit(task_name) {
    this.bdcWalkService.setTaskCompleted(task_name);
  }

  onTaskChanges() {
    // refresh the status of each task
    if(this.bdcWalkService.getTaskCompleted("taskClickOptionExcel") || this.bdcWalkService.getTaskCompleted("taskClickOptionManual")){
        this.submit("chooseOption");
    }
    if(this.bdcWalkService.getTaskCompleted("importFile") || this.bdcWalkService.getTaskCompleted("completeProducts")){
        this.submit("taskLoadProducts");
    }
    this.tasks.forEach(task => task.done = this.bdcWalkService.getTaskCompleted(task.name));
  }

  toggleShowWalkthough(visible: boolean) {
    this.bdcWalkService.setTaskCompleted(this.id, visible);
  }

  reset() {
    // reset all tasks
    this.bdcWalkService.reset();
    this.tasks = [
        {name: 'taskWelcome', title: 'Bienvenido', done: false},
        {name: 'taskClickProducts', title: 'Click en menu de navegación productos', done: false},
        {name: 'chooseOption', title: 'Elige una opción', done: false}
    ];
  }

  select_load_from_excel(){
    this.bdcWalkService.setTaskCompleted('taskClickOptionExcel');
    this.tasks = [
        {name: 'taskWelcome', title: 'Bienvenido', done: true},
        {name: 'taskClickProducts', title: 'Click en menu de navegación productos', done: true},
        {name: 'chooseOption', title: 'Elige una opción', done: true},
        {name: 'clickImport', title: 'Click en el menu de navegacion de importar', done: false},
        {name: 'downloadModel', title: 'Descargar el modelo del excel', done: false},
        {name: 'importFile', title: 'Completar los datos e importarlo', done: false},
        {name: 'clickClients', title: 'Click en el menu de Clientes', done: false},
        {name: 'clickListClients', title: 'Click en el submenu Lista Clientes', done: false},
        {name: 'newClient', title: 'Nuevo Cliente', done: false},
        {name: 'completeData', title: 'Completar los datos', done: false}
    ];
  }

  select_manual_load(){
    this.bdcWalkService.setTaskCompleted('taskClickOptionManual');
    this.tasks = [
        {name: 'taskWelcome', title: 'Bienvenido', done: true},
        {name: 'taskClickProducts', title: 'Click en menu de navegación productos', done: true},
        {name: 'chooseOption', title: 'Elige una opción', done: true},
        {name: 'clickProductList', title: 'Click en el menu de navegacion de productos', done: false},
        {name: 'clickNewProduct', title: 'Click en nuevo producto', done: false},
        {name: 'completeProducts', title: 'Completar un producto', done: false},
        {name: 'clickClients', title: 'Click en el menu de Clientes', done: false},
        {name: 'clickListClients', title: 'Click en el submenu Lista Clientes', done: false},
        {name: 'newClient', title: 'Nuevo Cliente', done: false},
        {name: 'completeData', title: 'Completar los datos', done: false}
    ];
  }

}

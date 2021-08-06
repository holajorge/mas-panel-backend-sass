import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-admin',
  templateUrl: './footer_admin.component.html',
  styleUrls: ['./footer_admin.component.scss']
})
export class FooterAdminComponent implements OnInit {
  test: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

}

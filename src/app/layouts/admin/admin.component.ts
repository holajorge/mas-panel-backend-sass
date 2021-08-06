import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isMobileResolution: boolean;
  constructor() {
    if (window.innerWidth < 1200) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
  @HostListener("window:resize", ["$event"])
  isMobile(event) {
    if (window.innerWidth < 1200) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
  }

}

import { Component, HostListener, OnInit } from '@angular/core';
import { WalkthroughService } from 'src/app/service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-super',
  templateUrl: './super.component.html',
  styleUrls: ['./super.component.scss']
})
export class SuperComponent implements OnInit {
  isMobileResolution: boolean;
  constructor(public onboardingService:WalkthroughService) { 
    if (window.innerWidth < 1200) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
  }
  @HostListener("window:resize", ["$event"])

  isMobile(event) {
    if (window.innerWidth < 1200) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

}

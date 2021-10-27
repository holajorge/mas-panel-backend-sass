import { Component, OnInit } from '@angular/core';
import { WalkthroughService } from '../../service/walkthrough/walkthrough.service';

@Component({
  selector: 'app-taskmanager',
  templateUrl: './taskmanager.component.html',
  styleUrls: ['./taskmanager.component.scss']
})
export class TaskmanagerComponent implements OnInit {
  constructor(private onboardingService:WalkthroughService) { }

  ngOnInit() {
  }

}

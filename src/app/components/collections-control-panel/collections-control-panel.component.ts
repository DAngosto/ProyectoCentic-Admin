import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';


@Component({
  selector: 'app-collections-control-panel',
  templateUrl: './collections-control-panel.component.html',
  styleUrls: ['./collections-control-panel.component.css']
})
export class CollectionsControlPanelComponent implements OnInit {

  constructor(private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.isUserValidated();

  }

}

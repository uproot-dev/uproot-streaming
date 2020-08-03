import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';
import { StorageService } from '../storage.service';
import { ENSService } from '../ens.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    constructor(public globals: Globals) {
      this.globals.storageProvider = new StorageService();
      this.globals.ensProvider = new ENSService();
    }

    ngOnInit(): void {}
}

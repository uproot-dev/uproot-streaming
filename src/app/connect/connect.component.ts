import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';

@Component({
	selector: 'app-connect',
	templateUrl: './connect.component.html',
	styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent implements OnInit {

  select = 'none'

	constructor(public globals: Globals) {}

	ngOnInit(): void {}

	connectChannel(address: string): any {

  }

  connectWallet(): any {}

	startStreaming(): any {
    this.globals.mode = 'stream';
  }
}

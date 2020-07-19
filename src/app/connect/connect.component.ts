import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-connect',
	templateUrl: './connect.component.html',
	styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent implements OnInit {

  select = 'none'

	constructor() {}

	ngOnInit(): void {}

	connectChannel(address: string): any {

  }

  connectWallet(): any {}

	startStreaming(): any {}
}

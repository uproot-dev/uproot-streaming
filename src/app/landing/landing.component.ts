import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
	constructor(public globals: Globals) {}

	ngOnInit(): void {}
}

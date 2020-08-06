import { Component, OnInit } from '@angular/core';
import ipfs from 'ipfs';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';

@Component({
    selector: 'app-watch',
    templateUrl: './watch.component.html',
    styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
    node: any;

    constructor(public globals: Globals, private modalService: ModalService) {}

    ngOnInit() {
    }
}

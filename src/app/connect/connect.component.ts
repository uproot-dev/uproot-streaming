import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';

@Component({
    selector: 'app-connect',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent implements OnInit {
    select = 'none';
    savedState = '';

    constructor(public globals: Globals, private modalService: ModalService) {}

    ngOnInit(): void {}

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    connectChannel(address: string): any {}

    startStreaming(): any {
        this.globals.mode = 'stream';
    }
}

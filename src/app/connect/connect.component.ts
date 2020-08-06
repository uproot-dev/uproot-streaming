import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-connect',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent implements OnInit {
    select = 'none';
    savedState = '';
    connectError = false;

    constructor(public globals: Globals, private modalService: ModalService) {}

    ngOnInit(): void {}

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    connectChannel(address: string): any {
        address = address.toLowerCase().replace('.eth', '').replace('.test', '');
        this.globals.ensProvider.setNode(address);
        this.globals.ensProvider.getTxRecord('stream').then(
            (result) => {
                if (result && result.length > 0) {
                    this.connectStream(result);
                } else this.connectError = true;
            },
            (err) => {
                console.warn(err);
                this.connectError = true;
            }
        );
    }

    connectStream(result: string) {
      this.globals.watchStream = result;
        if (result.includes('fleek')) this.httpGetAsync(result);
        if (result.includes('ipfs')) this.connectSteamIPFSAddress(result);
    }

    connectSteamIPFSAddress(address: string) {
      this.globals.watchMode = 'ipfs';
      this.globals.watchAddress = address;
      this.globals.mode = 'watch';
    }

    connectSteamFleekAddress(result: any) {
        //const title = $(result).filter('title').text().replace('ipfs','').replace('/','').replace(/\//g, '');
        const title = result;
        this.connectSteamIPFSAddress(title)
    }

    httpGetAsync(url: string) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) this.connectSteamFleekAddress(xmlHttp.responseText);
        };
        xmlHttp.open('GET', url, true);
        xmlHttp.send(null);
    }

    startStreaming(): any {
        this.globals.mode = 'stream';
    }
}

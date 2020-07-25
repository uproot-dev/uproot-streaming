import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_modal';
import { Globals } from '../app.globals';
import { ethers } from 'ethers';
import { StorageService } from '../storage.service';
import Web3 from 'web3';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    constructor(private modalService: ModalService, public globals: Globals, public storageService: StorageService) {}

    ngOnInit(): void {}

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    connectMetamask() {
        if (window['web3']) {
            this.globals.status = 'loading';
            window['web3'] = new Web3(window['web3'].currentProvider);
            window['ethereum'].enable().then(
                (accounts) => {
                    this.globals.status = 'connected';
                    this.globals.address = ethers.utils.getAddress(accounts[0]);
                    this.globals.provider = new ethers.providers.Web3Provider(window['web3'].currentProvider);
                },
                (err) => console.warn(err)
            );
        }
    }
}

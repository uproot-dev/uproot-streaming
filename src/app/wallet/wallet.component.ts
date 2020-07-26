import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_modal';
import { Globals } from '../app.globals';
import { ethers } from 'ethers';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';

import * as StreamerCredentials from '../../../build/contracts/StreamerCredentials.json';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    streamerCredentials: ethers.Contract;
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
                    this.globals.address = ethers.utils.getAddress(accounts[0]);
                    this.globals.provider = new ethers.providers.Web3Provider(window['web3'].currentProvider);
                    this.checkCredentials();
                },
                (err) => console.warn(err)
            );
        }
    }

    async checkCredentials() {
        this.streamerCredentials = new ethers.Contract(environment.credentialsAddress, StreamerCredentials.abi, this.globals.provider);
        const credentials = await this.streamerCredentials.getCredentials();
        if (credentials[0].length > 0) {
            this.globals.status = 'connected';
        } else {
            this.globals.status = 'registering';
        }
    }

    registerCredentials(key: string, secret: string, password: string, save: boolean) {
        console.log(key, secret, password, save);
        const test = this.encryptData(key, password);
        console.log(test);
        console.log(this.decryptData(test, password));
        console.log(this.decryptData(test, 'batata'));

    }

    encryptData(data: string, secret: string) {
        try {
            return CryptoJS.AES.encrypt(data, secret).toString();
        } catch (e) {
            console.warn(e);
        }
    }

    decryptData(data: string, secret: string) {
        try {
            const bytes = CryptoJS.AES.decrypt(data, secret);
            if (bytes.toString()) {
                return bytes.toString();
            }
            return bytes;
        } catch (e) {
            console.warn(e);
        }
    }
}

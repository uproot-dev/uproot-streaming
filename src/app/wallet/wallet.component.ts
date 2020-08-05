import { Component, OnInit, NgZone } from '@angular/core';
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
    passwordWrong = false;
    tempKey: string;
    tempSecret: string;

    constructor(private modalService: ModalService, public globals: Globals, private zone: NgZone) {}

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
                    this.globals.setProvider(new ethers.providers.Web3Provider(window['web3'].currentProvider), true);
                    this.globals.status = 'connected';
                },
                (err) => console.warn(err)
            );
        }
    }

    async checkCredentials() {
        this.streamerCredentials = new ethers.Contract(environment.credentialsAddress, StreamerCredentials.abi, this.globals.provider.getSigner());
        const credentials = await this.streamerCredentials.getCredentials();
        let key = credentials[0];
        let secret = credentials[1];
        let password;
        if (key.length > 0 && secret.length > 0) {
            this.globals.status = 'password';
            password = localStorage.getItem('SavedPassword');
            if (password) {
                key = this.decryptData(key, password);
                secret = this.decryptData(secret, password);
                if (key.length > 0 && secret.length > 0) this.initCredentials(key, secret);
                else console.warn('Could not unlock credentials with the saved password. Clear cache and try again.');
            } else {
                this.tempKey = key;
                this.tempSecret = secret;
                this.openModal('input-password');
            }
        } else {
            this.globals.status = 'registering';
        }
        this.zone.run(() => {});
    }

    unlockCredentials(password: string, save: boolean) {
        const key = this.decryptData(this.tempKey, password);
        const secret = this.decryptData(this.tempSecret, password);
        if (key.length > 0 && secret.length > 0) {
            this.initCredentials(key, secret).then(
                (result) => {
                    if (!result) {
                      this.passwordWrong = true;
                      return;
                    }
                    if (save) localStorage.setItem('SavedPassword', password);
                    this.closeModal('input-password');
                },
                (err) => {
                    console.warn(err);
                    this.passwordWrong = true;
                }
            );
        } else this.passwordWrong = true;
    }

    async initCredentials(key: string, secret: string): Promise<boolean> {
        const result = await this.globals.storageProvider.initKeys(key, secret);
        if (!result) return false;
        this.globals.status = 'connectedCredentials';
        this.zone.run(() => {});
        return true;
    }

    registerCredentials(key: string, secret: string, password: string, save: boolean) {
        this.globals.status = 'registering-wait';
        const safeApiKey = this.encryptData(key, password);
        const safeApiSecret = this.encryptData(secret, password);
        if (save) localStorage.setItem('SavedPassword', password);
        this.streamerCredentials.setCredentials(safeApiKey, safeApiSecret).then(
            () => {
                this.initCredentials(key, secret);
            },
            (err) => console.warn('registerCredentials ' + err)
        );
    }

    encryptData(data: string, secret: string) {
        try {
            return CryptoJS.AES.encrypt(data, secret).toString();
        } catch (err) {
            console.warn(err);
        }
    }

    decryptData(data: string, secret: string) {
        try {
            var bytes = CryptoJS.AES.decrypt(data, secret);
            var originalData = bytes.toString(CryptoJS.enc.Utf8);
            return originalData;
        } catch (err) {
            console.warn(err);
        }
    }
}

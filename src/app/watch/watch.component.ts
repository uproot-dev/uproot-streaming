import { Component, OnInit } from '@angular/core';
import ipfs from 'ipfs';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';
import { UmbralDEM } from '../../../node_modules/js-umbral/src/dem.js';
import { _decapsulateOriginal, _encapsulate } from '../../../node_modules/js-umbral/src/pre.js';
import { elliptic } from 'js-umbral';

@Component({
    selector: 'app-watch',
    templateUrl: './watch.component.html',
    styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
    node: any;

    constructor(public globals: Globals, private modalService: ModalService) {}

    ngOnInit() {}

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    decrypt(key: string, url: string) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'blob';
        request.onload = () => {
            this.receiveFile(key, <Blob>request.response);
        };
        request.send();
    }

    async receiveFile(secret: string, oFile: Blob) {
        this.openModal('view-file');
        const oldChild = document.getElementById('fileContents').firstChild;
        const childLoading = document.createElement('div');
        childLoading.innerHTML = 'Loading...';
        document.getElementById('fileContents').replaceChild(childLoading, oldChild);
        const fType = oFile.type;
        let child: any, data: string, type: string, file: File;
        if (fType.includes('octet-stream') || fType.includes('json')) ({ type, data, file } = await this.initDecryption(secret, oFile));
        else {
            type = fType;
            const contentBuffer = await this.readFileAsync(oFile);
            data = <string>contentBuffer;
        }
        if (type.includes('image')) {
            child = document.createElement('img');
            child.src = data;
        } else if (type.includes('text')) {
            child = document.createElement('div');
            child.innerHTML = atob(data.split(',')[1]);
        } else if (type.includes('video')) {
            child = document.createElement('video');
            child.src = data;
            child.controls = true;
        } else if (type.includes('audio')) {
            child = document.createElement('audio');
            child.src = data;
            child.controls = true;
        } else {
            child = document.createElement('div');
            child.innerHTML = data;
        }
        document.getElementById('fileContents').replaceChild(child, childLoading);
    }

    private async initDecryption(secret: string, fileD: Blob) {
        const EC = elliptic.ec;
        var secp256k1 = new EC('secp256k1');
        this.globals.encryptKeypar = secp256k1.genKeyPair();
        this.globals.encryptKeypar._importPrivate(secret);
        this.globals.encryptKeypar.getPublic();
        const { key, capsule } = _encapsulate(this.globals.encryptKeypar.pub);
        const { type, data, file } = await this.decryptFile(fileD, capsule);
        return { type, data, file };
    }

    async decryptFile(fileD: Blob, dummyCapsule: any) {
        const contentBuffer = await this.readFileAsync(fileD);
        const dataString = JSON.parse(atob(contentBuffer.split(',')[1]));
        const dataD = this.dataToArray(dataString.data);
        const capsule = dummyCapsule;
        capsule.bnSig.bn.words = dataString.cInfo.bn.bn.words;
        capsule.pointE.x.words = dataString.cInfo.pe.x.words;
        capsule.pointE.y.words = dataString.cInfo.pe.y.words;
        capsule.pointV.x.words = dataString.cInfo.pv.x.words;
        capsule.pointV.y.words = dataString.cInfo.pv.y.words;
        const key = _decapsulateOriginal(this.globals.encryptKeypar.priv, capsule);
        const decrypted = new UmbralDEM(key).decrypt(dataD, capsule.asBytes());
        const output = new TextDecoder('utf-8').decode(decrypted);
        const file = this.dataURLtoFile(output, 'test');
        const type = file.type;
        const data = output;
        return { type, data, file };
    }

    readFileAsync(file: Blob): Promise<any> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    dataURLtoFile(dataurl: string, filename: string): File {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    dataToArray(data: any) {
        let n = Object.keys(data).length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = data[n];
        }
        return u8arr;
    }
}

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
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload = (e) => {
                const result = <string>e.target.result;
                this.receiveFile(key, result);
            };
        };
        request.send();
    }

    receiveFile(secret: string, file: string) {
        this.openModal('view-file');
        let type = file.split(',')[0].split(';')[0].split(':')[1];
        let data = file.split(',')[1];
        let child;
        if (type.includes('octet-stream')) ({ data, type } = this.decryptFile(secret, data, type));
        if (type.includes('image')) {
            child = document.createElement('img');
            child.src = file;
        } else if (type.includes('text')) {
            child = document.createElement('div');
            child.innerHTML = data;
        } else if (type.includes('video')) {
            child = document.createElement('video');
            child.src = file;
            child.controls = true;
        } else if (type.includes('audio')) {
            child = document.createElement('audio');
            child.src = file;
            child.controls = true;
        } else {
            child = document.createElement('div');
            child.innerHTML = file;
        }
        const oldChild = document.getElementById('fileContents').firstChild;
        document.getElementById('fileContents').replaceChild(child, oldChild);
    }

    private decryptFile(secret: string, data: string, type: string) {
        const EC = elliptic.ec;
        var secp256k1 = new EC('secp256k1');
        this.globals.encryptKeypar = secp256k1.genKeyPair();
        this.globals.encryptKeypar._importPrivate(secret);
        this.globals.encryptKeypar.getPublic();
        const { pkey, capsule } = _encapsulate(this.globals.encryptKeypar.pub)
        const key = _decapsulateOriginal(this.globals.encryptKeypar.priv, capsule);
        const encoded = new TextEncoder().encode(data);
        const decrypted = new UmbralDEM(key).decrypt(encoded, capsule.asBytes());
        const output = new TextDecoder('utf-8').decode(decrypted);
        const dFile = this.dataURLtoFile(output, 'test');
        type = output.split(',')[0].split(';')[0].split(':')[1];
        data = output.split(',')[1];
        return { data, type };
    }

    dataURLtoFile(dataurl, filename): File {
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
}

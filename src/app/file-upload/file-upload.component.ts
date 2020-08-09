import { Component, OnInit, HostListener } from '@angular/core';
import { formatDate } from '@angular/common';
import { ModalService } from '../_modal';
import { Globals } from '../app.globals';
import { pre } from 'js-umbral';
import { UmbralDEM } from '../../../node_modules/js-umbral/src/dem.js';
import { _decapsulateOriginal, _encapsulate } from '../../../node_modules/js-umbral/src/pre.js';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
    public file: File | null = null;

    constructor(private modalService: ModalService, public globals: Globals) {}

    ngOnInit(): void {}

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
        const file = event && event.item(0);
        this.file = file;
    }

    async uploadFile() {
        if (this.globals.encryptStream) {
            const file = await this.encryptFile(this.file);
            this.globals.storageProvider.upload(file, file.name);
        } else this.globals.storageProvider.upload(this.file, this.file.name);
    }

    async encryptFile(file: File): Promise<File> {
        const contentBuffer = await this.readFileAsync(file);
        const data = new TextEncoder().encode(contentBuffer);
        let { ciphertext, capsule } = pre.encrypt(this.globals.encryptKeypar.pub, data);
        const name = formatDate(new Date(), 'yyyy-MM-dd_HH-mm-ss_SSS', 'en-US') + '_file';
        capsule.pointE.toJSON = undefined;
        capsule.pointV.toJSON = undefined;
        capsule.bnSig.toJSON = undefined;
        capsule.bnSig.bn.toJSON = undefined;
        capsule.pointE.curve.toJSON = undefined;
        capsule.pointE.x.toJSON = undefined;
        capsule.pointE.y.toJSON = undefined;
        capsule.pointV.curve.toJSON = undefined;
        capsule.pointV.x.toJSON = undefined;
        capsule.pointV.y.toJSON = undefined;
        const fileInfos = { data: ciphertext, cInfo: { pe: capsule.pointE, pv: capsule.pointV, bn: capsule.bnSig } };
        const dataString = JSON.stringify(fileInfos).toString();
        const efile = new File([dataString], name, { type: 'application/octet-stream' });
        return efile;
    }

    readFileAsync(file): Promise<any> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

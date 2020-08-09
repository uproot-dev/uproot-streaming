import { Component, OnInit, HostListener } from '@angular/core';
import { formatDate } from '@angular/common';
import { ModalService } from '../_modal';
import { Globals } from '../app.globals';
import { pre } from 'js-umbral';
import { _decapsulateOriginal } from '../../../node_modules/js-umbral/src/pre.js';

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
        const { ciphertext, capsule } = pre.encrypt(this.globals.encryptKeypar.pub, data);
        const name = formatDate(new Date(), 'yyyy-MM-dd_HH-mm-ss_SSS', 'en-US') + '_file';
        const efile = new File([ciphertext], name, { type: 'application/octet-stream' });
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

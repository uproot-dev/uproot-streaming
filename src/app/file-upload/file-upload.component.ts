import { Component, OnInit, HostListener } from '@angular/core';
import { ModalService } from '../_modal';
import { Globals } from '../app.globals';

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

    uploadFile() {
        const tx = this.globals.storageProvider.upload(this.file, this.file.name);
    }
}

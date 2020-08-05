import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit {
    hasRecord = false;
    ENSRecord = '';
    ENSFailed = false;
    hasStream = false;
    ENSStream = '';

    play = false;
    showChat = false;
    mic = false;
    video = false;
    screen = false;

    constructor(public globals: Globals, private modalService: ModalService) {}

    ngOnInit(): void {
        this.checkENSRecord();
    }

    checkENSRecord() {
        this.globals.ensProvider.lookupAddress(this.globals.address).then(
            (rName) => {
                this.hasRecord = rName.length > 0;
                this.ENSRecord = rName;
                if (this.hasRecord) this.setNode(rName, false);
                this.openModal('ens-registry');
            },
            (err) => {
                console.warn(err);
            }
        );
    }

    setENSRecord(hash: string) {
        this.globals.ensProvider.setTxRecord('stream', hash).then(
            (tx) => {
                tx.wait().then((result) => {
                    this.globals.status = 'ready';
                    this.closeModal('ens-record');
                });
            },
            (err) => {
                console.warn(err);
                this.ENSFailed = true;
            }
        );
        this.closeModal('ens-record');
    }

    configureENSRecord(name: string) {
        this.setNode(name);
        this.globals.ensProvider.lookupNodeAddress().then(
            (result) => {
                if (result == '0x0000000000000000000000000000000000000000') this.checkENSRecordOwner();
                else if (result == this.globals.address) this.hasRecord = true;
                else this.ENSFailed = true;
            },
            (err) => {
                console.warn(err);
                this.ENSFailed = true;
            }
        );
    }

    setNode(name: string, domain = true) {
        this.globals.ensProvider.setNode(name, domain);
        this.checkStream();
    }

    checkStream() {
        this.globals.ensProvider.getTxRecord('stream').then(
            (record) => {
              if (record.length > 0){
                this.ENSStream = record;
                this.hasStream = true;
                this.globals.status = 'ready';
              }
            },
            (err) => {
                console.warn(err);
                this.ENSFailed = true;
            }
        );
    }

    setRecordName() {
        this.globals.ensProvider.setAddr().then(
            (tx) => {
                console.log(tx);
                tx.wait().then((result) => {
                    console.log(result);
                    this.closeModal('ens-registry');
                    this.openModal('ens-record');
                });
            },
            (err) => {
                console.warn(err);
                this.ENSFailed = true;
            }
        );
    }

    checkENSRecordOwner() {
        this.globals.ensProvider.getOwner().then(
            (result) => {
                console.log(result);
                if (result == '0x0000000000000000000000000000000000000000') {
                    this.claimENSRecord();
                } else if (result == this.globals.address) this.setRecordName();
                else this.ENSFailed = true;
            },
            (err) => {
                console.warn(err);
                this.ENSFailed = true;
            }
        );
    }

    private claimENSRecord() {
        this.globals.ensProvider.registerRecord().then(
            (tx) => {
                console.log(tx);
                tx.wait().then(() => this.setRecordName());
            },
            (err) => {
                console.warn(err);
                this.ENSFailed = true;
            }
        );
    }

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
}

import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';
import { elliptic } from 'js-umbral';
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

    constructor(public globals: Globals, private modalService: ModalService) {}

    ngOnInit(): void {
        this.checkENSRecord();

        // video.js configuration
        this.globals.playerOptions = {
            controls: false,
            fill: true,
            responsive: true,
            bigPlayButton: false,
            children: {
                controlBar: {
                    fullscreenToggle: true,
                },
            },
            plugins: {
                // configure videojs-record plugin
                record: {
                    audio: true,
                    video: true,
                    debug: false,
                    screen: false,
                    maxLength: 100,
                    frameWidth: 640,
                    frameHeight: 480,
                    timeSlice: 5000,
                },
            },
        };
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
                if (record.length > 0) {
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

    startRecord() {
        this.openModal('start-record');
    }

    playRecord() {
        this.globals.player.record().loadOptions(this.globals.playerOptions);
        try {
            this.globals.player.record().start();
            this.play = !this.play;
        } catch (err) {}
    }

    stopRecord() {
        this.openModal('stop-record');
    }

    killRecord() {
        this.play = !this.play;
        this.globals.player.record().stop();
        this.globals.player.record().stopDevice();
    }

    mic() {
        return this.globals.playerOptions.plugins.record.audio;
    }

    video() {
        return this.globals.playerOptions.plugins.record.video;
    }

    screen() {
        return this.globals.playerOptions.plugins.record.screen;
    }

    toggleAudio() {
        this.globals.playerOptions.plugins.record.audio = !this.globals.playerOptions.plugins.record.audio;
    }

    toggleVideo() {
        this.globals.playerOptions.plugins.record.video = !this.globals.playerOptions.plugins.record.video;
    }

    toggleScreen() {
        this.globals.playerOptions.plugins.record.screen = !this.globals.playerOptions.plugins.record.screen;
    }

    updateKeys(secret: string) {
        this.globals.encryptStream = !this.globals.encryptStream;
        if (this.globals.encryptStream) {
            if (secret.length == 0 && this.globals.encryptSecret.length > 0) return;
            const EC = elliptic.ec;
            var secp256k1 = new EC('secp256k1');
            this.globals.encryptKeypar = secp256k1.genKeyPair();
            if (secret.length > 0) this.globals.encryptKeypar._importPrivate(secret);
            this.globals.encryptKeypar.getPublic();
            this.globals.encryptSecret = this.globals.encryptKeypar.inspect().slice(11, 75);
        }
    }
}

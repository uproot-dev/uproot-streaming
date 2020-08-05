import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import * as RecordRTC from 'recordrtc';

import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';

// register videojs-record plugin with this import
import * as Record from 'videojs-record/dist/videojs.record.js';
import { Globals } from '../app.globals';

@Component({
    selector: 'app-stream-box',
    templateUrl: './stream-box.component.html',
    styleUrls: ['./stream-box.component.scss'],
})
export class StreamBoxComponent implements OnInit, OnDestroy {
    // reference to the element itself: used to access events and methods
    private _elementRef: ElementRef;

    // index to create unique ID for component
    idx = 'clip1';

    private plugin: any;

    // constructor initializes our declared vars
    constructor(elementRef: ElementRef, public globals: Globals) {
        this.globals.player = false;

        // save reference to plugin (so it initializes)
        this.plugin = Record;
    }

    ngOnInit() {}

    ngAfterViewInit() {
        // ID with which to access the template's video element
        let el = 'video_' + this.idx;

        // setup the player via the unique element ID
        this.globals.player = videojs(document.getElementById(el), this.globals.playerOptions, () => {});

        this.globals.player.record().getDevice();

        // user completed recording and stream is available
        this.globals.player.on('finishRecord', () => {
            const blob = this.globals.player.recordedData;
            if (blob) {
                this.globals.storageProvider.upload(blob, blob.name);
            }
        });

        // error handling
        this.globals.player.on('error', (element, error) => {
            console.warn(error);
        });

        this.globals.player.on('deviceError', () => {
            console.error('device error:', this.globals.player.deviceErrorCode);
        });

        this.globals.player.on('timestamp', () => {
            const blob = this.globals.player.recordedData[this.globals.player.recordedData.length - 1];
            if (blob) {
                this.globals.storageProvider.upload(blob, blob.name);
            }
        });
    }

    // use ngOnDestroy to detach event handlers and remove the player
    ngOnDestroy() {
        if (this.globals.player) {
            this.globals.player.dispose();
            this.globals.player = false;
        }
    }
}

import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ENSService } from './ens.service';

@Injectable()
export class Globals {
    mode = 'connect';
    status = 'disconected';

    address: string;
    provider: any;
    storageProvider: StorageService;
    ensProvider: ENSService;
    player: any;
    playerOptions: {
        controls: boolean;
        fill: boolean;
        responsive: boolean;
        bigPlayButton: boolean;
        plugins: {
            record: {
                audio: boolean;
                video: boolean;
                debug: boolean;
                screen: boolean;
                maxLength: number;
                frameWidth: number;
                frameHeight: number;
                timeSlice: number;
            };
        };
    };

    setProvider(provider: any, signer: boolean) {
        this.provider = provider;
        this.ensProvider.configureProvider(provider, signer);
    }
}

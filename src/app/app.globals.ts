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
    playerOptions: any;

    watchStream: string;
    watchAddress: string;
    watchMode: string;

    encryptStream = false;
    encryptKeypar: any;
    encryptSecret = '';

    setProvider(provider: any, signer: boolean) {
        this.provider = provider;
        this.ensProvider.configureProvider(provider, signer);
    }
}

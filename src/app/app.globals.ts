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

    setProvider(provider: any, signer: boolean) {
      this.provider = provider;
      this.ensProvider.configureProvider(provider, signer);
    }
}

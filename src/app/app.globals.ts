import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class Globals {
    mode = 'connect';
    status = 'disconected';

    address: string;
    provider: any;
    storageProvider: StorageService;
}

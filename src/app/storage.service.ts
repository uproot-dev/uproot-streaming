import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const fleekStorage = require('@fleekhq/fleek-storage-js');

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    get(key: string): any {
        const options = ['data', 'bucket', 'key', 'hash', 'publicUrl'];
        const params = { apiKey: environment.fleekApiKey, apiSecret: environment.fleekApiSecret, key: key, getOptions: options };
        fleekStorage.get(params).then(
            (file) => {
                return file;
            },
            (err) => console.warn('get ' + err)
        );
    }

    getFile(key: string): any {
        return this.get(key)[0];
    }

    upload(file: any, key: string): any {
        const params = { apiKey: environment.fleekApiKey, apiSecret: environment.fleekApiSecret, key: key, data: file };
        fleekStorage.upload(params).then(
            (answer) => {
                console.log(answer);
            },
            (err) => console.warn('upload ' + err)
        );
    }

    getFileByHash(hash: string): any {
        fleekStorage.getFileFromHash(hash).then(
            (file) => {
                return file;
            },
            (err) => console.warn('getFileByHash ' + err)
        );
    }
}

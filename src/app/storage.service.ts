import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const fleekStorage = require('@fleekhq/fleek-storage-js');

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    fleekApiKey: string;
    fleekApiSecret: string;

    constructor() {}

    initKeys(password: string, key: string, secret: string) {}

    get(key: string): any {
        const options = ['data', 'bucket', 'key', 'hash', 'publicUrl'];
        const params = { apiKey: this.fleekApiKey, apiSecret: this.fleekApiSecret, key: key, getOptions: options };
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
        const params = { apiKey: this.fleekApiKey, apiSecret: this.fleekApiSecret, key: key, data: file };
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

    async listFiles(bucket = '') {
        const options = ['bucket', 'key', 'hash', 'publicUrl'];
        let params = { apiKey: this.fleekApiKey, apiSecret: this.fleekApiSecret, getOptions: options };
        if (bucket.length > 0) params["bucket"] = bucket;
        const answer = await  fleekStorage.listFiles(params);
        return answer;
    }

    async listBuckets() {
        const answer = await fleekStorage.listBuckets({
            apiKey: this.fleekApiKey,
            apiSecret: this.fleekApiSecret,
        });
        return answer;
    }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const fleekStorage = require('@fleekhq/fleek-storage-js');

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    apiKey: string;
    apiSecret: string;

    constructor() {}

    async initKeys(key: string, secret: string): Promise<boolean> {
      this.apiKey = key;
      this.apiSecret = secret;
      const result = await this.listBuckets();
      return (result && result.length > 0);
    }

    get(key: string): any {
        const options = ['data', 'bucket', 'key', 'hash', 'publicUrl'];
        const params = { apiKey: this.apiKey, apiSecret: this.apiSecret, key: key, getOptions: options };
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
        const params = { apiKey: this.apiKey, apiSecret: this.apiSecret, key: key, data: file };
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
        let params = { apiKey: this.apiKey, apiSecret: this.apiSecret, getOptions: options };
        if (bucket.length > 0) params["bucket"] = bucket;
        const answer = await  fleekStorage.listFiles(params);
        return answer;
    }

    async listBuckets() {
        const answer = await fleekStorage.listBuckets({
            apiKey: this.apiKey,
            apiSecret: this.apiSecret,
        });
        return answer;
    }
}

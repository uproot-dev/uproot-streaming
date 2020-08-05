import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as ENSRegistry from '../../build/contracts/ENSRegistry.json';
import * as ENSRegistrar from '../../build/contracts/ENSRegistrar.json';
import * as ENSReverseRegistrar from '../../build/contracts/ENSReverseRegistrar.json';
import * as ENSPublicResolver from '../../build/contracts/ENSPublicResolver.json';
import * as ethers from 'ethers';

@Injectable({
    providedIn: 'root',
})
export class ENSService {
    provider: any;
    ens: any;
    domain = environment.ENSDomain;
    registrarContract: any;
    reverseRegistrarContract: any;
    reverseResolverContract: any;
    resolverContract: any;
    address: any;
    name: string;
    node: string;

    constructor() {}

    public setNode(name: string, domain = true) {
        this.name = name;
        const hashName = domain ? name + this.domain : name;
        this.node = ethers.utils.namehash(hashName);
    }

    public getNodeHash(name: string): string {
        return ethers.utils.namehash(name);
    }

    public getNode(name: string): string {
        return this.getNodeHash(name + this.domain);
    }

    public getSubNode(label: string): string {
        return this.getNodeHash(label + '.' + this.name + this.domain);
    }

    public async configureProvider(service, setupAccount = true) {
        this.provider = service;
        this.ens = new ethers.Contract(environment.ENSRegistryAddress, ENSRegistry.abi, setupAccount ? this.provider.getSigner() : this.provider);
        this.registrarContract = new ethers.Contract(environment.ENSRegistrarAddress, ENSRegistrar.abi, setupAccount ? this.provider.getSigner() : this.provider);
        this.reverseRegistrarContract = new ethers.Contract(environment.ENSReverseRegistrarAddress, ENSReverseRegistrar.abi, setupAccount ? this.provider.getSigner() : this.provider);
        await this.reverseRegistrarContract.deployed();
        const reverseResolverAddress = await this.reverseRegistrarContract.defaultResolver();
        this.reverseResolverContract = new ethers.Contract(reverseResolverAddress, ENSPublicResolver.abi, setupAccount ? this.provider.getSigner() : this.provider);
        this.resolverContract = new ethers.Contract(environment.ENSPulbicResolverAddress, ENSPublicResolver.abi, setupAccount ? this.provider.getSigner() : this.provider);
        await this.resolverContract.deployed();
        if (setupAccount)
            this.provider.listAccounts().then((addresses) => {
                this.address = addresses[0];
            });
    }

    public async registeredTimeToLive(): Promise<Date> {
        const ttl = await this.registrarContract.expiryTimes(ethers.utils.formatBytes32String(name));
        return new Date(ttl * 1000);
    }

    public async setName(name = this.name, address = this.address) {
        return await this.resolverContract.setAddr(ethers.utils.namehash(name + this.domain), address);
    }

    public async setAddr(node = this.node, address = this.address) {
        return await this.resolverContract.setAddr(node, address);
    }

    public async registerRecord(label = this.name, owner = this.address) {
        try {
            const tx = await this.registrarContract.register(ethers.utils.namehash(label), owner);
            await tx.wait();
        } catch (err) {}
        return await this.ens.setResolver(ethers.utils.namehash(label), environment.ENSPulbicResolverAddress);
    }

    public async setSubnodeRecord(label: string, owner: string, resolver = environment.ENSPulbicResolverAddress, ttl = 0, _node = this.node) {
        return await this.ens.setSubnodeRecord(_node, ethers.utils.formatBytes32String(label), owner, resolver, ttl);
    }

    public async hasRecord(node: string): Promise<boolean> {
        return await this.ens.recordExists(node);
    }

    public async lookupAddress(address: string): Promise<string> {
        const node = await this.reverseRegistrarContract.node(address);
        const name = await this.reverseResolverContract.name(node);
        return name;
    }

    public async lookupAddressNode(address: string): Promise<string> {
        return await this.reverseRegistrarContract.node(address);
    }

    public async lookupNodeAddress(_node = this.node): Promise<string> {
        return await this.resolverContract.addr(_node);
    }

    public async getOwner(_node = this.node) {
        return await this.ens.owner(_node);
    }

    public async getResolverContract(node: string, sign: boolean) {
        if (node === this.node) return this.resolverContract;
        const address = await this.ens.resolver(node);
        const contract = new ethers.Contract(address, ENSPublicResolver.abi, sign ? this.provider.getSigner() : this.provider);
        await contract.deployed();
        return contract;
    }

    public async setTxRecord(key: string, text: string, _node = this.node) {
        const contract = await this.getResolverContract(_node, true);
        return await contract.setText(_node, key, text);
    }

    public async getTxRecord(key: string, _node = this.node): Promise<string> {
        const contract = await this.getResolverContract(_node, false);
        return await contract.text(_node, key);
    }

    public async getTxEmail(_node = this.node): Promise<string> {
        return await this.getTxRecord(_node, 'email');
    }

    public async getTxURL(_node = this.node): Promise<string> {
        return await this.getTxRecord(_node, 'url');
    }

    public async getTxAvatar(_node = this.node): Promise<string> {
        return await this.getTxRecord(_node, 'avatar');
    }

    public async getTxDescription(_node = this.node): Promise<string> {
        return await this.getTxRecord(_node, 'description');
    }

    public async getTxNotice(_node = this.node): Promise<string> {
        return await this.getTxRecord(_node, 'notice');
    }

    public async getTxKeywordsString(_node = this.node): Promise<string> {
        return await this.getTxRecord(_node, 'keywords');
    }

    public async getTxKeywordsArray(_node = this.node): Promise<Array<string>> {
        const val = await this.getTxKeywordsString(_node);
        return val.split(',');
    }

    public async checkENSRecord(_node = this.node): Promise<boolean> {
        return await this.ens.recordExists(_node);
    }

    public async getTTL() {
        return '';
        //TODO:
    }
}

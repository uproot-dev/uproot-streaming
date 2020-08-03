// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  credentialsAddress: '0xf340e187ff28e39e6cd9b8d16bf78abed02dd36c',
	ENSRegistryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
	ENSRegistrarAddress: '0x09B5bd82f3351A4c8437FC6D7772A9E6cd5D25A1', //TestRegistrar
	ENSPulbicResolverAddress: '0x42D63ae25990889E35F215bC95884039Ba354115', //TestResolver
	ENSReverseRegistrarAddress: '0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c',
	ENSDomain: '.test',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

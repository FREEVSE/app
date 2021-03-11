import * as application from "@nativescript/core/application";
import { Observable, Observer } from "rxjs";
import { concatMap } from "rxjs/operators";

const NSD_SVC: android.net.nsd.NsdManager = (application.android.context as android.content.Context).getSystemService(android.content.Context.NSD_SERVICE);

export class ZeroconfBrowser {
    private _obs: Observable<ZeroconfService>;

    constructor(
        serviceType:string = "_services._dns-sd._udp",
        timeout: number = 9000) {

        this._obs = new Observable((observer: Observer<ZeroconfService>) => {
            const proto = android.net.nsd.NsdManager.PROTOCOL_DNS_SD;
            const listener = new android.net.nsd.NsdManager.DiscoveryListener({
                onStartDiscoveryFailed: (svcType: string, error: number): void => { 
                    observer.error(`Service discovery failed (${svcType}). Error: ${error}`) 
                },

                onStopDiscoveryFailed: (svcType: string, error: number): void => { 
                    observer.error(`Service discovery failed (${svcType}). Error: ${error}`) 
                },

                onDiscoveryStarted: (param: string): void => {
                    console.log("Zeroconf service discovery started")
                },

                onDiscoveryStopped: (param: string): void => {
                    console.log("Zeroconf service discovery stopped");
                    observer.complete(); 
                },

                onServiceFound: (svc: android.net.nsd.NsdServiceInfo): void => { 
                    observer.next(new ZeroconfService(svc)) 
                },

                onServiceLost: (svc: android.net.nsd.NsdServiceInfo): void => {
                    console.log(`Zeroconf service no longer available. ${svc.getServiceName()}`);
                }
            });

            NSD_SVC.discoverServices(serviceType, proto, listener);
            setTimeout(() => NSD_SVC.stopServiceDiscovery(listener), timeout);
        });
    }

    public Discover(): Observable<ZeroconfService> {
        return this._obs;
    }

    public DiscoverAndResolve(): Observable<ZeroconfService> {
        return this._obs.pipe(
            concatMap(svc => svc.Resolve())
        ) 
    }


}

export class ZeroconfService {
    private _svcInfo: android.net.nsd.NsdServiceInfo;
    constructor(
        svcInfo: android.net.nsd.NsdServiceInfo) {
        this._svcInfo = svcInfo;
    }

    get Type(): string { return this._svcInfo.getServiceType() }
    get Name(): string { return this._svcInfo.getServiceName() }
    get Address(): string { return this._svcInfo.getHost().toString().slice(1) }
    get Port(): number { return this._svcInfo.getPort() }

    public Resolve(): Observable<ZeroconfService> {
        return new Observable<ZeroconfService>((observer: Observer<ZeroconfService>) => {
            let resolveListener = new android.net.nsd.NsdManager.ResolveListener({
                onResolveFailed: (svcInfo: android.net.nsd.NsdServiceInfo, error: number) => {
                    observer.error(`Service resolution failed. Error: ${error}`);
                },
                onServiceResolved: (svcInfo: android.net.nsd.NsdServiceInfo) => {
                    this._svcInfo = svcInfo; //Such a shame...
                    observer.next(this);
                    observer.complete();
                }
            });

            NSD_SVC.resolveService(this._svcInfo, resolveListener);
        });
    }

    public TestResolve(): void{
        let resolveListener = new android.net.nsd.NsdManager.ResolveListener({
            onResolveFailed: (svcInfo: android.net.nsd.NsdServiceInfo, error: number) => {
                console.error(`Service resolution failed. Error: ${error}`);
            },
            onServiceResolved: (svcInfo: android.net.nsd.NsdServiceInfo) => {
                console.info(`Service resolved!`)
            }
        });

        NSD_SVC.resolveService(this._svcInfo, resolveListener);
    }
}

import { Application } from "@nativescript/core";
import { Observable, Observer } from "rxjs";
import { concatMap } from "rxjs/operators";

export class ZeroconfBrowser {
    private _manager: android.net.nsd.NsdManager;
    private _obs: Observable<ZeroconfService>;

    constructor(timeout: number = 3000) {
        this._manager = new android.net.nsd.NsdManager();

        this._obs = new Observable((observer: Observer<ZeroconfService>) => {
            const proto = android.net.nsd.NsdManager.PROTOCOL_DNS_SD;
            const listener = new android.net.nsd.NsdManager.DiscoveryListener({
                onStartDiscoveryFailed: (svcType: string, error: number): void => { observer.error(`Service discovery failed (${svcType}). Error: ${error}`) },
                onStopDiscoveryFailed: (svcType: string, error: number): void => { observer.error(`Service discovery failed (${svcType}). Error: ${error}`) },
                onDiscoveryStarted: null,
                onDiscoveryStopped: (param: string): void => { observer.complete(); },
                onServiceFound: (svc: android.net.nsd.NsdServiceInfo): void => { observer.next(new ZeroconfService(this._manager, svc)) },
                onServiceLost: null
            });

            this._manager.discoverServices("_services._dns-sd._udp", proto, listener);
            setTimeout(() => this._manager.stopServiceDiscovery(listener), timeout);
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
    private _manager: android.net.nsd.NsdManager;
    private _svcInfo: android.net.nsd.NsdServiceInfo;
    constructor(
        manager: android.net.nsd.NsdManager,
        svcInfo: android.net.nsd.NsdServiceInfo) {
        this._manager = manager;
        this._svcInfo = svcInfo;
    }

    get Type(): string { return this._svcInfo.getServiceType() }
    get Name(): string { return this._svcInfo.getServiceName() }
    get Address(): string { return this._svcInfo.getHost().toString() }
    get Port(): number { return this._svcInfo.getPort() }

    public Resolve(): Observable<ZeroconfService> {
        return new Observable<ZeroconfService>((observer: Observer<ZeroconfService>) => {
            const resolveListener = new android.net.nsd.NsdManager.ResolveListener({
                onResolveFailed: (svcInfo: android.net.nsd.NsdServiceInfo, error: number) => {
                    observer.error(`Service resolution failed. Error: ${error}`);
                },
                onServiceResolved: (svcInfo: android.net.nsd.NsdServiceInfo) => {
                    observer.next(this);
                    observer.complete();
                }
            });

            this._manager.resolveService(this._svcInfo, resolveListener);
        });
    }
}

import { Observable, ObservableArray, Frame } from '@nativescript/core';
import { ZeroconfBrowser, ZeroconfService } from "./net/zeroconf/zeroconf.android"
import { firebase } from "@nativescript/firebase"
import { messaging } from "@nativescript/firebase/messaging"

export class HelloWorldModel extends Observable {
    private _searching: boolean = true;
	private _zcServices: ObservableArray<ZeroconfService>;

    constructor() {
        super();
        
        this._zcServices = new ObservableArray<ZeroconfService>();
    }

    get Searching(): boolean{
		return this._searching;
	}

	set Searching(val: boolean) {
		if(this._searching != val){
			this._searching = val;
			this.notifyPropertyChange("Searching", val);
		}
	}

	get ZeroconfDevices(): ObservableArray<ZeroconfService>{
		return this._zcServices;
	}

	private ListZeroConfDevices(){
		this.Searching = true;

		const browser = new ZeroconfBrowser("_freevserpc._tcp");
		browser.DiscoverAndResolve().subscribe(
			zeroConf => {
				console.info(`Name ${zeroConf.Name} - Type: ${zeroConf.Type}`);
				this._zcServices.push(zeroConf);
			},
			error => console.error(error),
			() => {
				this.Searching = false;
			}
		)
	}

	onListViewLoaded(){
		this.ListZeroConfDevices();
	}
}

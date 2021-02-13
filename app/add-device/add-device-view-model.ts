import { Observable } from '@nativescript/core';
import { ZeroconfBrowser } from "../net/zeroconf/zeroconf.android"

export class AddDeviceViewModel extends Observable {

	private _searching: boolean = true;

	constructor() {
		super();
		this.ListZeroConfDevices();
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

	private ListZeroConfDevices(){
		this.Searching = true;

		const browser = new ZeroconfBrowser();
		browser.DiscoverAndResolve().subscribe(
			zeroConf => console.info(zeroConf),
			error => console.error(error),
			() => console.info("done searching for ZeroConf devices")
		)

		this.Searching = false;
	}

}
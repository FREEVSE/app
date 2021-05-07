import { Bluetooth, Peripheral } from '@nativescript-community/ble';
import {Observable, ObservableArray} from '@nativescript/core';

export class AddDeviceViewModel extends Observable {

	private _bleDevices: ObservableArray<Peripheral>;

	constructor() {
		super();

		this._bleDevices = new ObservableArray<Peripheral>();
	}

	get BleDevices(): ObservableArray<Peripheral>{
		return this._bleDevices;
	}

	private async Scan(): Promise<void>{
		var ble = new Bluetooth();

		var res = await ble.enable();
	
		if(res){
			return ble.startScanning({
				seconds: 4,
				onDiscovered: (peripheral) => {
					if(
						peripheral.name &&
						this._bleDevices.filter((existing) => existing.UUID == peripheral.UUID).length == 0){
						this._bleDevices.push(peripheral);
					}
				}
			  });
		}
	}

	onListViewLoaded(){
		this.Scan();
	}
}
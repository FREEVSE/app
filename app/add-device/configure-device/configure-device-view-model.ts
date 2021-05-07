import { Peripheral } from '@nativescript-community/ble';
import {Observable} from '@nativescript/core';

export class ConfigureDeviceViewModel extends Observable {

	private _peripheral: Peripheral;

	constructor(peripheral: Peripheral) {
		super();
		this._peripheral = peripheral;
	}

}
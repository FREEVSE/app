import {Observable} from '@nativescript/core';
import { ZeroconfService } from '../net/zeroconf/zeroconf.android'

export class DeviceViewModel extends Observable {

	private _svc: ZeroconfService;
	private _hwv: string;
	private _fwv: string;
	private _state: string;
	private _maxOutput: number;

	constructor(svc: ZeroconfService) {
		super();

		this._svc = svc;
	}

	get Name(): string { return this._svc.Name }
	get Address(): string { return `${this._svc.Address}:${this._svc.Port}` } 

	get HwVersion(): string { return this._hwv; }
	set HwVersion(hwv: string) {
		this._hwv = hwv;
		this.notifyPropertyChange("HwVersion", hwv);
	}

	get FwVersion(): string { return this._fwv; }
	set FwVersion(fwv: string) {
		this._fwv = fwv;
		this.notifyPropertyChange("FwVersion", fwv);
	}

	get MaxOutput(): number { return this._maxOutput; }
	set MaxOutput(maxOut: number) {
		this._maxOutput = maxOut;
		this.notifyPropertyChange("MaxOutput", maxOut);
	}

	get State(): string { return this._state; }
	set State(state: string) {
		this._state = state;
		this.notifyPropertyChange("State", state);
	}

}
import { Peripheral } from '@nativescript-community/ble';
import { EventData, Frame, ItemEventData, Page } from '@nativescript/core';
import { ConfigureDeviceViewModel } from './configure-device-view-model';
import * as application from '@nativescript/core/application';
import { BlufiClient, BlufiCallback } from '@freevse/nativescript-blufi';


declare var com: any;

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	let peripheral = page.navigationContext['svc'] as Peripheral;
	page.bindingContext = new ConfigureDeviceViewModel(peripheral);
	let btDev = android.bluetooth.BluetoothAdapter.getDefaultAdapter().getRemoteDevice(peripheral.UUID);

	let ctx = application.android.context;
	let client = new BlufiClient(ctx, btDev) //new com.esp32.blufi.BlufiClient(ctx, btDev);
	let callbacks
	//client.connect();
}

export function navigatingFrom(args: EventData){

}
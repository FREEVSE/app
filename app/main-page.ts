/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData, Frame, ItemEventData, Page } from '@nativescript/core';
import { HelloWorldModel } from './main-view-model';
import * as application from '@nativescript/core/application';
import { Bluetooth } from '@nativescript-community/ble'

let page: Page;

export function navigatingTo(args: EventData) {
	page = <Page>args.object;
	page.bindingContext = new HelloWorldModel();
}

export async function onAddDeviceTap() {
	//android.bluetooth.BluetoothAdapter.getDefaultAdapter().getRemoteDevice()
	//let test = new com.esp32.blufi.BlufiClient(application.android.context, );
    Frame.topmost().navigate({
		moduleName: "add-device/add-device-page"
	});
}

export function onDeviceTap(args: ItemEventData) {
    const index = args.index;
	const svc = (page.bindingContext as HelloWorldModel).ZeroconfDevices.getItem(index);

	Frame.topmost().navigate({
		moduleName: "device/device-page",
		context: { svc: svc }
	});
}
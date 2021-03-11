/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData, Frame, ItemEventData, Page } from '@nativescript/core';
import { HelloWorldModel } from './main-view-model';

export function navigatingTo(args: EventData) {
	page = <Page>args.object;

	page.bindingContext = new HelloWorldModel();
}

export function onAddDeviceTap() {
    Frame.topmost().navigate("add-device/add-device-page");
}

let page: Page;



export function onDeviceTap(args: ItemEventData) {
    const index = args.index;
	const svc = (page.bindingContext as HelloWorldModel).ZeroconfDevices.getItem(index);

	Frame.topmost().navigate({
		moduleName: "add-device/add-device-details/add-device-details-page",
		context: { svc: svc }
	});
}
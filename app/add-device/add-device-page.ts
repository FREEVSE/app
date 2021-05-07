import { EventData, Frame, ItemEventData, Page } from '@nativescript/core';
import { AddDeviceViewModel } from './add-device-view-model';

let page: Page;

export async function navigatingTo(args: EventData) {
	page = <Page>args.object;
	page.bindingContext = new AddDeviceViewModel();
}

export function onDeviceTap(args: ItemEventData) {
    const index = args.index;
	const svc = (page.bindingContext as AddDeviceViewModel).BleDevices.getItem(index);

	Frame.topmost().navigate({
		moduleName: "add-device/configure-device/configure-device-page",
		context: { svc: svc }
	});
}
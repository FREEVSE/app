import { EventData, Label, Page, StackLayout } from '@nativescript/core';
import { ZeroconfService } from '~/net/zeroconf/zeroconf.android';
import { DeviceViewModel } from './device-view-model';
import { request, getJSON } from '@nativescript/core/http';

let page: Page;

export async function navigatingTo(args: EventData) {
	page = <Page>args.object;
	let svc = page.navigationContext['svc'] as ZeroconfService;
	page.bindingContext = new DeviceViewModel(svc);

	await GetDeviceInfo(svc);
}

async function GetDeviceInfo(svc: ZeroconfService){
	let url = `http://${svc.Address}:${svc.Port}/rpc/DeviceInfo`;

	console.log(`Contacting device at ${svc.Address}:${svc.Port}`);

	let req = getJSON(url)

	let vm = page.bindingContext as DeviceViewModel;

	let res = await req;

	console.log(`Reply: ${res}`);


	vm.HwVersion = res["hwv"];
	vm.FwVersion = res["fwv"];
	vm.State = res["state"];
	vm.MaxOutput = res["maxOutput"];
}
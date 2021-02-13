import { EventData, Label, Page, StackLayout } from '@nativescript/core';;
import { AddDeviceViewModel } from './add-device-view-model';

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;

	page.bindingContext = new AddDeviceViewModel();

	let stack = <StackLayout> page.getViewById("stackLayout");

	let label = new Label();
	label.text = "hellooooo";
	stack.insertChild(label, 0);
}
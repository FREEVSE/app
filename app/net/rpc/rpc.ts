import { request } from '@nativescript/core/http';

export class RpcClient{
    private _ep: string;

    constructor(endpoint: string){
        this._ep = endpoint;
    }

    private async Call<TReply, TArgs=any>(proc: string, args?: TArgs): Promise<TReply>;
    private async Call<TArgs>(proc: string, args: TArgs){
        let payload = {
            proc: proc,
            args: args
        };

        let res = await request({
            url: this._ep,
            method: "GET",
            content: JSON.stringify(payload)
        });

        if(res.statusCode != 200) throw("RPC call failed.")

        return res.content.toJSON();
    }

    public GetDeviceInfo(): Promise<DeviceInfo>{
        return this.Call("getDeviceInfo");
    }    

    public GetMaxOutput(): Promise<number>{
        return this.Call("getMaxOutput");
    }

    public SetMaxOutput(amps: number){
        return this.Call("setMaxOutput", amps);
    }

    public GetAmbientTemp(): Promise<number>{
        return this.Call("getAmbientTemp");
    }
}

interface DeviceInfo{
    HwVersion: string;
    FwVersion: string;
    Charging?: boolean;
    SessionTime?: number;
    MaxOutput: number;
    SSID: string;
    Messages: string[];
}

class RpcException extends Error{
    constructor(message: string){
        super(message);
    }
}
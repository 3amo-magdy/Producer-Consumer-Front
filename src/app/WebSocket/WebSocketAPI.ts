import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { AppComponent } from '../app.component';
import { update } from '../Response/update';

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://localhost:8080/sim';
    topic: string = "/sim/update";
    stompClient: any;
    appComponent: AppComponent;
    constructor(appComponent: AppComponent){
        this.appComponent = appComponent;
    }
    _connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame:any) {
            console.log("connected to : "+frame);
            _this.stompClient.subscribe(_this.topic, function (sdkEvent:any) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error:Error) {
        console.log("errorCallBack -> " + error)
        // setTimeout(() => {
        //     this._connect();
        // }, 5000);
    }

 /**
  * Send message to sever via web socket
  * @param {*} message 
  */
    _send(message:string) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(update:update) {
        console.log("Message Recieved from Server :: " + update);
        this.appComponent.handleMessage(update);
    }
}

// 

import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class SocketService {
    constructor(private socket: Socket) {}

    testSendingMethod(data: string): void {
        this.socket.emit('score', data);
    }

    testReceivingMessage(): Observable<any> {
        return this.socket.fromEvent('received');
    }
}
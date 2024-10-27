import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { SocketInfo } from "../poker-main/poker-main.component";


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

    joinRoom(data: SocketInfo) {
        this.socket.emit('join', data);
    }

    recieveBroadCastForNewUser(): Observable<SocketInfo> {
        return this.socket.fromEvent('newUser')
    }
}
import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { SocketInfo } from "./user-data.model";
// import { Soc } from "";


@Injectable({
    providedIn: 'root',
})
export class SocketService {
    constructor(private socket: Socket) {}

    /**
     * 
     * @param user 
     */
    joinRoom(user: SocketInfo) {
        this.socket.emit('join', user);
    }

    /**
     * 
     * @param user 
     */
    updateScore(user: SocketInfo) {
        this.socket.emit('updateScore', user);
    }

    /**
     * 
     * @param hidden 
     * @param roomNumber 
     */
    toggleCards(hidden: boolean, roomNumber: string) {
        const dataToSend = {
            room: roomNumber,
            estimatesHidden: hidden
        }
        this.socket.emit('toggleCards', dataToSend);
    }

    /**
     * Triggers delete event in the backend
     * @param roomNumber room number
     */
    deleteEstimatesEvent(roomNumber: string): void {
        this.socket.emit('deleteEstimates', roomNumber);
    }


    /**
     * triggers show avg event
     * @param roomNumber 
     */
    showAvgDialog(roomNumber: string): void {
        this.socket.emit('triggerAvg', roomNumber);
    }

    
    /**
     * returned to the newUser on 'join;
     * @returns array of existing users
     */
    receiveExisitngUsers(): Observable<SocketInfo[]> {
        return this.socket.fromEvent('existingUsers')
    }

    /**
     * returned to existing users when new user joins 
     * @returns new user who joined
     */
    receiveBroadCastForNewUser(): Observable<SocketInfo> {
        return this.socket.fromEvent('newUser')
    }


    /**
     * 
     * @returns user who updated the score with the score info
     */
    receiveUpdatedScore(): Observable<SocketInfo> {
        return this.socket.fromEvent('scoreUpdated');
    }

    /**
     * 
     * @returns the toggled value of the cards
     */
    receiveToggledCards(): Observable<boolean> {
        return this.socket.fromEvent('toggleScoreCards');
    } 


    /**
     * Deletes the scores
     * @returns boolean value true
     */
    delete(): Observable<boolean> {
        return this.socket.fromEvent('delete');
    } 

    /**
     * 
     * @returns boolean true to show avg dialog
     */
    triggerShowAvg(): Observable<boolean> {
        return this.socket.fromEvent('showAvg');
    }
}
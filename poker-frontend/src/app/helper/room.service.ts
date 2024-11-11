import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    // private apiUrl = 'http://localhost:3000/api';
    private apiUrl = 'https://web-sockets-backend.onrender.com/api';

    constructor(private http: HttpClient) {}

    /**
     * 
     * @param roomNumber Check if the room exists
     * @returns boolean for exists
     */
    checkRoomExists(roomNumber: string | any): Observable<{exists: boolean}> {
        return this.http.get<{exists: boolean}>(`${this.apiUrl}/check/${roomNumber}`);
    }

    /**
     * Creates a new room 
     * @returns return the new room number
     */
    getNewRoom(): Observable<{roomNumber: string}> {
        return this.http.get<{roomNumber: string}>(`${this.apiUrl}/getRoom`);
    }

}
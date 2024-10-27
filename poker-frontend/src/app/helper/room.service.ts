import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    checkRoomExists(roomNumber: string | any): Observable<{exists: boolean}> {
        return this.http.get<{exists: boolean}>(`${this.apiUrl}/check/${roomNumber}`);
    }

    getNewRoom(): Observable<{roomNumber: string}> {
        return this.http.get<{roomNumber: string}>(`${this.apiUrl}/getRoom`);
    }

}
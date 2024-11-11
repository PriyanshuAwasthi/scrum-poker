import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { RoomService } from '../helper/room.service';
import { RoomNotFoundDialogComponent } from '../room-not-found-dialog/room-not-found-dialog.component';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root' // Ensure this is present
})
export class RoomGuard implements CanActivate {
  constructor(
    private roomService: RoomService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    const roomId = route.paramMap.get('room');

    return this.roomService.checkRoomExists(roomId).pipe(
      map((res) => {
        if (res.exists) {
          return true; // Room exists, proceed with navigation
        } else {
          // Room does not exist, navigate to the route and show dialog
          this.dialog.open(RoomNotFoundDialogComponent);
          return false;
        }
      }),
    )
  }
};

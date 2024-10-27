import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogResult, JoinRoomDialogComponent } from '../join-room-dialog/join-room-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {
  dialog = inject(MatDialog);
  constructor(private router: Router) {}

  joinOrCreateRoom(type: string): void {
    const dialogRef = this.dialog.open(JoinRoomDialogComponent, {
      data: {
        type: type
      }
    });
    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (!this.isNullOrUndefined(result)) {
        console.log(result);
        this.router.navigate([`/room/${result.roomNumber}`], {
          state: {
            result
          }
        })
      }
    })
  }

  isNullOrUndefined(data: any): boolean {
    return data === undefined || data === null || data == '' || data.length === 0 || data.size === 0;
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../join-room-dialog/join-room-dialog.component';


@Component({
  selector: 'app-average-dialog',
  templateUrl: './average-dialog.component.html',
  styleUrl: './average-dialog.component.css'
})
export class AverageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AverageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AverageDialogData
  ) {

  }
}

export interface AverageDialogData {
  avg: number;
}
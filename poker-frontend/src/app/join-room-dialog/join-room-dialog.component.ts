import { Component, Inject, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../helper/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-room-dialog',
  templateUrl: './join-room-dialog.component.html',
  styleUrl: './join-room-dialog.component.css'
})
export class JoinRoomDialogComponent {
  roomNumberDoesNotExists: boolean = false;

  form: FormGroup<typedForm> = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JoinRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private roomService: RoomService,
    private router: Router
  ) {
    if (this.data.type === 'Join') {
      this.form.addControl('room', this.fb.nonNullable.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[0-9]{4}'),
          this.falseRoomNumberValidator()
        ]
      }))
    }
  }

  falseRoomNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.roomNumberDoesNotExists ? { roomDoesNotExist: true } : null
    }
  } 

  onProceed(): void {
    if (this.data.type === 'Join' || this.data.type === 'joinExisting') {
      let room = this.isNullOrUndefined(this.form.controls.room?.value) ? this.data.room : this.form.controls.room?.value
      this.roomService.checkRoomExists(room).subscribe({
        next: (res) => {
          // If room does not exists meaning roon number is wrong
          if (!res.exists) {
            this.form.controls.room?.setErrors({
              'roomDoesNotExist': true
            });
          }
          else {
            let data: DialogResult = Object.assign(<DialogResult>{
              name: this.form.controls.name.value,
              email: this.form.controls.email.value,
              room: room,
            })
            this.dialogRef.close(data);
          }
        }
      })
    } 
    else {
      this.roomService.getNewRoom().subscribe({
        next: (res) => {
          if (!this.isNullOrUndefined(res)) {
            let data: DialogResult = Object.assign(<DialogResult>{
              name: this.form.controls.name.value,
              email: this.form.controls.email.value,
              room: res.roomNumber
            })
            this.dialogRef.close(data);
          }
        }
      })
    }
  }


  roomNumberError(): string {
    if (this.form.controls.room?.hasError('pattern')) {
      return 'Please enter a Valid room number'
    }
    if (this.form.controls.room?.hasError('roomDoesNotExist')) {
      return 'This room does not exists'
    }
    return '';
  }


  isNullOrUndefined(data: any): boolean {
    return data === undefined || data === null || data == '' || data.length === 0 || data.size === 0;
  }
}

export interface DialogData {
  type: string;
  room?: string;
}


interface typedForm {
  name: FormControl<string>;
  email: FormControl<string>;
  room?: FormControl<string>;
}

export interface DialogResult {
  name: string;
  email: string;
  room: string;
}
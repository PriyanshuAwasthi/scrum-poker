import { NgModule } from "@angular/core";
import { JoinRoomDialogComponent } from "./join-room-dialog.component";
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [JoinRoomDialogComponent],
    imports: [CommonModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatInputModule],
    providers: []
})
export class JoinRoomDialogModule {}
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { RoomNotFoundDialogComponent } from "./room-not-found-dialog.component";

@NgModule({
    declarations: [RoomNotFoundDialogComponent],
    imports: [CommonModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatInputModule],
    providers: []
})
export class RoomNotFoundDialogModule {}
import { NgModule } from "@angular/core";
import { AverageDialogComponent } from "./average-dialog.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";

@NgModule({
    declarations: [AverageDialogComponent],
    imports: [CommonModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatInputModule],
    providers: []
})
export class AverageDialogModule {}
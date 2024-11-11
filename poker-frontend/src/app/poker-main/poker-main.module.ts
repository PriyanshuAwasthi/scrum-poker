import { ChangeDetectorRef, NgModule } from "@angular/core";
import { PokerMainComponent } from "./poker-main.component";
import { CommonModule } from "@angular/common";
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import {MatCardModule} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { PokerRoutingModule } from "./poker-main-routin.module";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AverageDialogModule } from "../average-dialog/average-dialog.module";



@NgModule({
    declarations: [PokerMainComponent],
    imports: [
        MatCheckboxModule, 
        MatButtonModule, 
        PokerRoutingModule, 
        MatIconModule, 
        CommonModule, 
        MatTableModule, 
        CommonModule, 
        MatButtonModule, 
        MatTooltipModule, 
        MatCardModule, 
        MatDivider,
        FormsModule,
        ReactiveFormsModule,
        AverageDialogModule
    ],
    providers: []
})
export class PokerMainModule {}
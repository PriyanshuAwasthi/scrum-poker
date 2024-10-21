import { NgModule } from "@angular/core";
import { PokerMainComponent } from "./poker-main.component";
import { CommonModule } from "@angular/common";
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import {MatCardModule} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { PokerRoutingModule } from "./poker-main-routin.module";


@NgModule({
    declarations: [PokerMainComponent],
    imports: [PokerRoutingModule, MatIconModule, CommonModule, MatTableModule, CommonModule, MatButtonModule, MatTooltipModule, MatCardModule, MatDivider],
    providers: []
})
export class PokerMainModule {}
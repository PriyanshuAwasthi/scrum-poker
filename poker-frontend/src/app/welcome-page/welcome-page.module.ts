import { NgModule } from "@angular/core";
import { WelcomePageComponent } from "./welcome-page.component";
import { WelcomePageRoutingModule } from "./welcome-page-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { JoinRoomDialogModule } from "../join-room-dialog/join-room-dialog.module";

@NgModule({
    declarations: [WelcomePageComponent],
    imports: [JoinRoomDialogModule, WelcomePageRoutingModule, MatButtonModule],
    providers: []
})
export class WelcomePageModule {}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PokerMainComponent } from "./poker-main.component";

const routes: Routes = [
    {
        path: '**',
        component: PokerMainComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PokerRoutingModule {}
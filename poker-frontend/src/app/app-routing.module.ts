import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomGuard } from './guards/room.guard';
import { PokerMainComponent } from './poker-main/poker-main.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./welcome-page/welcome-page.module').then((m) => m.WelcomePageModule)
  },
  {
    path: 'room/:room',
    loadChildren: () => import('./poker-main/poker-main.module').then((m) => m.PokerMainModule),
    canActivate: [RoomGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

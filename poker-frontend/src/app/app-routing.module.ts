import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./welcome-page/welcome-page.module').then((m) => m.WelcomePageModule)
  },
  {
    path: 'room/:roomNumber',
    loadChildren: () => import('./poker-main/poker-main.module').then((m) => m.PokerMainModule)
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

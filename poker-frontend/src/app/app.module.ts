import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokerMainModule } from './poker-main/poker-main.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {}
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PokerMainModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

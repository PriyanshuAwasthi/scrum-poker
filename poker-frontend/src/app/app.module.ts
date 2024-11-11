import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokerMainModule } from './poker-main/poker-main.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { RoomGuard } from './guards/room.guard';

// const socketConfig: SocketIoConfig = {
//   url: 'http://localhost:3000',
//   options: {}
// }

// const socketConfig: SocketIoConfig = {
//   url: 'https://web-sockets-backend.onrender.com/',
//   options: {}
// }

const socketConfig: SocketIoConfig = {
  url: 'https://web-sockets-backend.onrender.com/',
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
    HttpClientModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [RoomGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

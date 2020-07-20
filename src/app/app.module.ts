import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingComponent } from './landing/landing.component';
import { ConnectComponent } from './connect/connect.component';
import { StreamComponent } from './stream/stream.component';
import { WatchComponent } from './watch/watch.component';
import { ChatComponent } from './chat/chat.component';
import { Globals } from './app.globals';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ConnectComponent,
    StreamComponent,
    WatchComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }

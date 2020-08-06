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
import { ModalModule } from './_modal';
import { Globals } from './app.globals';
import { WalletComponent } from './wallet/wallet.component';
import { StorageService } from './storage.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StreamBoxComponent } from './stream-box/stream-box.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { WatchFileListComponent } from './watch-file-list/watch-file-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ConnectComponent,
    StreamComponent,
    WatchComponent,
    ChatComponent,
    WalletComponent,
    FileUploadComponent,
    StreamBoxComponent,
    ChatBoxComponent,
    WatchFileListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule,
    NgbModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }

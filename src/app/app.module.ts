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

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ConnectComponent,
    StreamComponent,
    WatchComponent,
    ChatComponent,
    WalletComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule,
    NgbModule
  ],
  providers: [Globals, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

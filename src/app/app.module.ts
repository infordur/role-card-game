import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './_pages/game/game.component';
import { StorageModule } from '@ngx-pwa/local-storage';
import { ChooseCharacterComponent } from './_pages/choose-character/choose-character.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ChooseCharacterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StorageModule.forRoot({ IDBNoWrap: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerService } from './services/player.service';
import { DataModule } from '../../../../src2/app/services/data-module/data.module';
import { AppRoutingModule } from './app-routing-module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataModule.forRoot()
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

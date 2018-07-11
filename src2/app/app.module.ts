import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MatSliderModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import { ChromeMessageService } from './services/chrome-message.service';
import { DataService } from './services/data.service';
import { LocalStorageDbService } from './services/local-storage-db.service';
import { PlayerService } from './services/player.service';
import { AppLoadService } from './services/app-load.service';

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    QuoteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    AppLoadService,
   /*  { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }, */
    ChromeMessageService,
    DataService,
    LocalStorageDbService,
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}

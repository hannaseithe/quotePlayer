import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MatAutocompleteModule, MatDialogModule, MatSliderModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, MatTableModule, MatToolbarModule, MatChipsModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TagInputModule } from 'ngx-chips';
import { DragulaModule } from 'ng2-dragula';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import { DataService } from './services/data.service';
import { LocalStorageDbService } from './services/local-storage-db.service';
import { PlayerService } from './services/player.service';
import { AppLoadService } from './services/app-load.service';
import { AllQuotesComponent } from './all-quotes/all-quotes.component';
import { CdkTableModule } from '@angular/cdk/table';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from './check-delete-dialog/check-delete-dialog.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BackgroundComponent } from './background/background.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AllPlaylistsComponent } from './all-playlists/all-playlists.component';
import { PouchDbService } from './services/pouch-db.service';
import { PlaylistComponent } from './playlist/playlist.component';

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    QuoteComponent,
    AllQuotesComponent,
    QuoteDialogComponent,
    CheckDeleteDialogComponent,
    NavbarComponent,
    BackgroundComponent,
    AllPlaylistsComponent,
    PlaylistComponent
  ],
  imports: [
    CdkTableModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatAutocompleteModule,
    TagInputModule,
    DragulaModule.forRoot()
  ],
  providers: [
    PouchDbService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    DataService,
    LocalStorageDbService,
    PlayerService
  ],
  entryComponents: [QuoteDialogComponent, CheckDeleteDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}

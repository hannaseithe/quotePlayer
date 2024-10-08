import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { DataModule } from './services/data-module/data.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdePopoverModule } from '@material-extended/mde';

import { AppRoutingModule, CanDeactivateDocGuard } from './app-routing.module';

import { AppComponent } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import { AppLoadService } from './services/app-load.service';
import { AllQuotesComponent, DatasourceFilterPipe } from './all-quotes/all-quotes.component';
import { CdkTableModule } from '@angular/cdk/table';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from './check-delete-dialog/check-delete-dialog.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AllPlaylistsComponent } from './all-playlists/all-playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SharedMaterialModule } from './app.shared-material.module';
import { InfoModule } from './info/info.module';
import { QuotesTableComponent } from './quotes-table/quotes-table.component';
import { ReportBugComponent } from './report-bug/report-bug.component';
import { HttpClientModule } from '@angular/common/http';

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
    AllPlaylistsComponent,
    PlaylistComponent,
    DatasourceFilterPipe,
    QuotesTableComponent,
    ReportBugComponent
  ],
  imports: [
    CdkTableModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    MaterialFileInputModule,
    DragulaModule.forRoot(),
    DataModule.forRoot(),
    FlexLayoutModule,
    HttpClientModule,
    InfoModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    CanDeactivateDocGuard
  ],
  entryComponents: [QuoteDialogComponent, CheckDeleteDialogComponent, ReportBugComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { SharedMaterialModule } from '../app.shared-material.module';
import { InfoService } from './info.service';
import { QuotesInfoComponent } from './quotes-info/quotes-info.component';
import { PlaylistsInfoComponent } from './playlists-info/playlists-info.component';
import { SelectedPlaylistInfoComponent } from './selected-playlist-info/selected-playlist-info.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { PopupInfoComponent } from './popup-info/popup-info.component';
import { TableOfContentsComponent } from './table-of-contents/table-of-contents.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { WindowsNotificationInfoComponent } from './windows-notification-info/windows-notification-info.component';


@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    ScrollDispatchModule
  ],
  declarations: [ImportExcelComponent, 
    QuotesInfoComponent, 
    PlaylistsInfoComponent, 
    SelectedPlaylistInfoComponent, 
    GeneralInfoComponent, 
    PopupInfoComponent, 
    TableOfContentsComponent, WindowsNotificationInfoComponent],
  entryComponents: [
    ImportExcelComponent,
    QuotesInfoComponent,
    PlaylistsInfoComponent,
    SelectedPlaylistInfoComponent,
    GeneralInfoComponent
  ],
  providers: [InfoService]
})
export class InfoModule { }

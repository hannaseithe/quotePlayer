import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { SharedMaterialModule } from '../app.shared-material.module';
import { InfoService } from './info.service';
import { QuotesInfoComponent } from './quotes-info/quotes-info.component';
import { PlaylistsInfoComponent } from './playlists-info/playlists-info.component';
import { SelectedPlaylistInfoComponent } from './selected-playlist-info/selected-playlist-info.component';


@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule
  ],
  declarations: [ImportExcelComponent, QuotesInfoComponent, PlaylistsInfoComponent, SelectedPlaylistInfoComponent],
  entryComponents: [
    ImportExcelComponent,
    QuotesInfoComponent,
    PlaylistsInfoComponent,
    SelectedPlaylistInfoComponent
  ],
  providers: [InfoService]
})
export class InfoModule { }

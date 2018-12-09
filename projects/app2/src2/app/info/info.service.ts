import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { QuotesInfoComponent } from './quotes-info/quotes-info.component';
import { PlaylistsInfoComponent } from './playlists-info/playlists-info.component';
import { SelectedPlaylistInfoComponent } from './selected-playlist-info/selected-playlist-info.component';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private dialog: MatDialog) { }

  openInfoDialog(compName) {
    let comp;
    let isSet = true;
    switch (compName) {
      case 'quotes':
        comp = QuotesInfoComponent;
        break;
      case 'playlists':
        comp = PlaylistsInfoComponent;
        break;
      case 'selectedPlaylist':
        comp = SelectedPlaylistInfoComponent;
        break;
      case 'importExcel':
        comp = ImportExcelComponent;
        break;
      default:
        isSet = false;
        break;
    }

    /*     var msg = new SpeechSynthesisUtterance('Hello World');
        window.speechSynthesis.speak(msg); */

    if (isSet) {
      let dialogRef = this.dialog.open(comp, {
        data: {}
      });
    }

  }
}

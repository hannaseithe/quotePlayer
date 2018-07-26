import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { PlayerService } from '../services/player.service';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { PlaylistDialogComponent } from '../playlist-dialog/playlist-dialog.component';
import { Playlist } from '../data-model/playlist.model';

@Component({
  selector: 'app-all-playlists',
  templateUrl: './all-playlists.component.html',
  styleUrls: ['./all-playlists.component.css']
})
export class AllPlaylistsComponent implements OnInit {

  dataSource: Playlist[] = [];

  displayedColumns = ['ID', 'edit'];

  constructor(private data: DataService,
    public dialog: MatDialog,
    private player: PlayerService) {
    data.allPlaylists.subscribe(x => this.dataSource = x);
  }

  ngOnInit() {
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(PlaylistDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  edit(element): void {
    let dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '500px',
      data: { element: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  delete(element): void {
    let dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      width: '500px',
      data: { element: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.deleteQuote(element);
      }

      console.log('The dialog was closed');
    });
  }

}

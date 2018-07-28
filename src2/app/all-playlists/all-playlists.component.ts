import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { PlayerService } from '../services/player.service';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { Playlist } from '../data-model/playlist.model';
import { FormControl, FormBuilder } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-all-playlists',
  templateUrl: './all-playlists.component.html',
  styleUrls: ['./all-playlists.component.css']
})
export class AllPlaylistsComponent implements OnInit {

  dataSource: Playlist[] = [];
  selectedPlaylist: Playlist;
  allQuotes: Quote[];

  displayedColumns = ['name', 'edit'];
  displayedColumns2 = ['quote', 'author', 'source', 'tags'];

  newQuoteForm = this.formbuilder.group({
    quote: ''
  });
  displayFn = (q) => q.quote;

  constructor(private data: DataService,
    public dialog: MatDialog,
    private player: PlayerService,
    private formbuilder: FormBuilder) {
    data.allPlaylists.subscribe(x => {
      this.dataSource = x;
      if (this.selectedPlaylist) {
        this.selectedPlaylist = x.filter((x) => x.ID === this.selectedPlaylist.ID)[0]
      }  
    });
    data.allQuotes.subscribe(x => this.allQuotes = x);
  }

  ngOnInit() {
  }

  selectRow(row) {
    this.selectedPlaylist = row;
  }

  onSubmit() {
    this.data.saveOrUpdatePlaylist(this.prepareSubmitSelectedPlaylist());
  }

  prepareSubmitSelectedPlaylist() {
    const formModel = this.newQuoteForm.value;
    this.selectedPlaylist.quoteDocs.push(formModel.quote);
    this.selectedPlaylist.quotes = this.selectedPlaylist.quoteDocs.map(q => q.ID)
    return this.selectedPlaylist;
  };


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

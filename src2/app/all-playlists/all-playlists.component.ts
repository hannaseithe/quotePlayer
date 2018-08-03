import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-all-playlists',
  templateUrl: './all-playlists.component.html',
  styleUrls: ['./all-playlists.component.css']
})
export class AllPlaylistsComponent implements OnInit {

  dataSource: Playlist[] = [];
  selectedPlaylist: Playlist;
  allQuotes: Quote[];
  editElement: Playlist;

  displayedColumns = ['name', 'edit'];
  displayedColumns2 = ['quote', 'author', 'source', 'tags', 'edit'];

  newQuoteForm = this.formbuilder.group({
    quote: null
  });
  displayFn = (q) => q ? q.quote : undefined;
  subs = new Subscription();

  constructor(private data: DataService,
    public dialog: MatDialog,
    private player: PlayerService,
    private formbuilder: FormBuilder,
    private dragulaService: DragulaService,
    private cd: ChangeDetectorRef) {
    data.allPlaylists.subscribe(x => {
      this.dataSource = x;
      if (this.selectedPlaylist) {
        this.selectedPlaylist = x.filter((x) => x.ID === this.selectedPlaylist.ID)[0]
      }
    });
    data.allQuotes.subscribe(x => this.allQuotes = x);
    dragulaService.destroy('QUOTES');
    dragulaService.createGroup('QUOTES', {
      revertOnSpill: true,
      moves: function (el: any, container: any, handle: any): any {
        if (el.classList.contains('mat-header-row')) {
          return false; // this will not allow any header to move
        }
        // console.log(el, container);
        return true;
      }
    });
    this.subs.add(this.dragulaService.dropModel("QUOTES")
      .subscribe(({ sourceModel }) => {
        console.log("name", name);
        this.onDrop(sourceModel);
      })
    );

  }

  private onDrop(newQuoteDocs) {
    this.selectedPlaylist.quoteDocs = newQuoteDocs;
    this.data.saveOrUpdatePlaylist(this.prepareSubmitSelectedPlaylist());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
  }

  selectRow(row) {
    this.selectedPlaylist = row;
    console.log(row);
  }

  onSubmit() {
    this.data.saveOrUpdatePlaylist(this.prepareSubmitSelectedPlaylist());
    
    this.newQuoteForm.reset();
  }

  prepareSubmitSelectedPlaylist() {
    if (this.newQuoteForm.value.quote) {
      const formModel = this.newQuoteForm.value;
      this.selectedPlaylist.quoteDocs.push(formModel.quote);
    }

    this.selectedPlaylist.quotes = this.selectedPlaylist.quoteDocs.map(q => q.ID)
    return this.selectedPlaylist;
  };


  edit(element): void {
    this.editElement = element;
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
  deleteQuote(element, index) {
    this.data.deleteQuoteFromPlaylist(this.selectedPlaylist, index)
  }

}

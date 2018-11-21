import { Component, OnInit, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data-module/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { Playlist } from '../data-model/playlist.model';
import { FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-all-playlists',
  templateUrl: './all-playlists.component.html',
  styleUrls: ['./all-playlists.component.scss']
})
export class AllPlaylistsComponent implements OnInit {

  dataSource: any[] = [];
  selectedPlaylist: Playlist;
  selectedQuote: Quote;
  allQuotes: Quote[];
  filteredQuotes: Observable<Quote[]>;
  editElement: Playlist;
  panelOpenState = false;


  displayedColumns = ['name', 'edit'];
  displayedColumns2 = ['quote', 'author', 'source', 'tags', 'edit'];
  displayedColumns3 = ['quote', 'author', 'source', 'tags'];

  addQuotesInProgress = false;

  subs = new Subscription();

  constructor(private data: DataService,
    public dialog: MatDialog,
    private dragulaService: DragulaService,
    private snackBar: MatSnackBar) {

    this.subs.add(data.allPlaylists
      .subscribe(x => {
        this.dataSource = x;
        if (this.selectedPlaylist) {
          this.selectedPlaylist = x.filter((x) => x.ID === this.selectedPlaylist.ID)[0]
        }
      })
    );

    this.subs.add(data.allQuotes.subscribe(x => this.allQuotes = x));

    dragulaService.destroy('QUOTES');
    dragulaService.createGroup('QUOTES', {
      revertOnSpill: true,
      moves: function (el: any): any {
        if (el.classList.includes('mat-header-row')) {
          return false; // this will stop the header from moving
        }
        return true;
      }
    });

    this.subs.add(this.dragulaService.dropModel("QUOTES")
      .subscribe(({ sourceModel }) => {
        this.onDrop(sourceModel);
      })
    );

  }

  displayFn = (q) => q ? (q.quote.length > 25 ? q.quote.substr(0, 25) + '...' : q.quote) : undefined;

  ngOnInit() {
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
  }

  selectRow(row) {
    this.selectedPlaylist = row;
  }

  onSubmit() {
    this.addQuotesInProgress = true;
    this.data.saveOrUpdatePlaylist(this.prepareSubmitSelectedPlaylist())
      .then(() => this.addQuotesInProgress = false)
      .catch((error) => {
        this.addQuotesInProgress = false;
        this.snackBar.open(error, "Quotes Not Added to Playlist", { duration: 2000 })
      })
  }

  prepareSubmitSelectedPlaylist() {
    this.selectedPlaylist.quotes = this.selectedPlaylist.quoteDocs.map(q => q.ID)
    return this.selectedPlaylist;
  };

  addQuoteDialog(): void {
    let dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '90%'
    });

    this.subs.add(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPlaylist.quoteDocs.push(...result);
        this.onSubmit();
      }
    }));
  }


  edit(element): void {
    this.editElement = element;
    this.panelOpenState = true;
  }

  delete(element): void {
    let dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      width: '500px',
      data: { element: element }
    });

    this.subs.add(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        element.deletePLInProgress = true;
        this.data.deletePlaylist(element)
          .then(() => element.deletePLInProgress = false)
          .catch((error) => {
            element.deleteInPorgress = false;
            this.snackBar.open(error, "Playlist Not Deleted", { duration: 2000 });
          })
      }
    }))
  }
  deleteQuote(element, index) {
    element.deleteInProgress = true;
    this.data.deleteQuoteFromPlaylist(this.selectedPlaylist, index)
      .then(() => element.deleteInProgress = false)
      .catch((error) => {
        element.deleteInProgress = false;
        this.snackBar.open(error, "QuoteNotDeleted", { duration: 2000 });
      })
  }

  private onDrop(newQuoteDocs) {
    this.selectedPlaylist.quoteDocs = newQuoteDocs;
    this.data.saveOrUpdatePlaylist(this.prepareSubmitSelectedPlaylist())
      .catch(error => this.snackBar.open(error, "Quote Order not Changed", { duration: 2000 }));
  }
}

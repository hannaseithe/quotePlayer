import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { PlayerService } from '../services/player.service';
import { Observable } from '../../../node_modules/rxjs/Observable';

@Component({
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css']
})
export class AllQuotesComponent implements OnInit {

  dataSource: Quote[] = [];
  authors: any[]= [];
  editElement: Quote; /* = {
    quote: '',
    author: '',
    source: '',
    tags:[],
    playlists: []
  }; */

  displayedColumns = ['quote', 'author', 'source', 'tags', 'playlists', 'edit'];

  constructor(private data: DataService,
    public dialog: MatDialog,
    private player: PlayerService) {
    data.allQuotes.subscribe(x => this.dataSource = x);
    data.allAuthors.subscribe(x => this.authors = x);
  }

  ngOnInit() {
  }


  getAuthors(): void {
    
  }


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
}

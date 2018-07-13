import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';

@Component({
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css']
})
export class AllQuotesComponent implements OnInit {

  dataSource: BehaviorSubject<Quote[]>;

  displayedColumns = ['quote', 'author', 'source', 'edit'];

  constructor(private data: DataService,
    public dialog: MatDialog) {
    this.dataSource = data.allQuotes;
    this.dataSource.subscribe(x => console.log(x));
  }

  ngOnInit() {
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

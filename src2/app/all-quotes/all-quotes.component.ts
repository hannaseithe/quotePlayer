import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';

@Component({
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css']
})
export class AllQuotesComponent implements OnInit {

  dataSource: BehaviorSubject<Quote[]>; 

  displayedColumns = ['quote', 'author', 'source', 'edit'];

  constructor(private data: DataService, public dialog: MatDialog) {
    this.dataSource = data.allQuotes;
   }

  ngOnInit() {
  }

  edit(element): void {
    let dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '250px',
      data: { element: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

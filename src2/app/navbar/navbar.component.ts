import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  subs = new Subscription();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  addQuoteDialog(): void {
    let dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '500px'
    });

    this.subs.add(dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    }));
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(public dialog: MatDialog) {

  }

  

}

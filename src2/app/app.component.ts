import { Component } from '@angular/core';
import { PlayerService } from './services/player.service';
import { MatDialog } from '@angular/material';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private player: PlayerService, public dialog: MatDialog) {

  }

  
  openDialog(): void {
    let dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

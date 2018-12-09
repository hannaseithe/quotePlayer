import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ReportBugComponent } from '../report-bug/report-bug.component';
import { InfoService } from '../info/info.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  subs = new Subscription();

  constructor(public dialog: MatDialog,
    private info: InfoService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }


  report(): void {
    let dialogRef = this.dialog.open(ReportBugComponent, {
      width: '500px',
      data: {}
    });

    this.subs.add(dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      }));
  }
}

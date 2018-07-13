import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-check-delete-dialog',
  templateUrl: './check-delete-dialog.component.html',
  styleUrls: ['./check-delete-dialog.component.css']
})
export class CheckDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CheckDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

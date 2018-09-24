import { Component, OnInit, Inject, PipeTransform, Pipe } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data-module/data.service';
import { SelectionModel } from '@angular/cdk/collections';


@Pipe({
  name: 'datasourceFilter',
  pure: false
})
export class DatasourceFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || (Object.keys(filter).length === 0 && filter.constructor === Object)) {
      return items;
    }


    return items.filter(item => {
      for (let filterKey in filter) {
        if (item[filterKey].toString().indexOf(filter[filterKey].value) === -1) {
          return false
        }
      }
      return true
    });
  }
}

@Component({
  selector: 'app-quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.css']
})
export class QuoteDialogComponent implements OnInit {

  dataSource: Quote[] = [];
  authors: any[] = [];
  editElement: Quote;
  filterArgs = {};

  selection = new SelectionModel<Quote>(true, []);

  displayedColumns = ['select','quote', 'author', 'source', 'tags'];

  constructor(
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public dialog: MatDialog) {
    dataService.allQuotes.subscribe(x => this.dataSource = x);
    dataService.allAuthors.subscribe(x => this.authors = x);
  }

  ngOnInit() {
  }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose(event): void {
    this.dialogRef.close(this.selection.selected);
  }

  applyFilter(field: string, value: string) {
    this.filterArgs[field] = {
      value: value.trim(),
      field: field
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach(row => this.selection.select(row));
  }

}

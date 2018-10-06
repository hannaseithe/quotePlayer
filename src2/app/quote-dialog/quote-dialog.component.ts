import { Component, OnInit, Inject, PipeTransform, Pipe } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data-module/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from '../../../node_modules/rxjs';


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
        if ((item[filterKey] || "").toString().indexOf(filter[filterKey].value) === -1) {
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
  paginatedDatasource: Quote[];
  authors: any[] = [];
  editElement: Quote;
  filterArgs = {};

  subs = new Subscription();

  dsPipe = new DatasourceFilterPipe;
  pageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0
  };

  selection = new SelectionModel<Quote>(true, []);

  displayedColumns = ['select','quote', 'author', 'source', 'tags'];

  constructor(
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public dialog: MatDialog) {
    this.subs.add(dataService.allQuotes.subscribe(x => { 
      this.dataSource = x;
      this.updateDatasource();
    }));
    this.subs.add(dataService.allAuthors.subscribe(x => this.authors = x));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose(event): void {
    this.dialogRef.close(this.selection.selected);
  }

  handlePageEvent(event) {
    this.pageEvent = event;
    this.updateDatasource();
  }

  updateDatasource() {
    this.paginatedDatasource = this.dsPipe
      .transform(this.dataSource, this.filterArgs)
      .slice(this.pageEvent.pageSize * (this.pageEvent.pageIndex), this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1));
    console.log(event);
  }

  applyFilter(field: string, value: string) {
    this.filterArgs[field] = {
      value: value.trim(),
      field: field
    }

    this.paginatedDatasource = this.dsPipe
    .transform(this.dataSource, this.filterArgs)
    .slice(this.pageEvent.pageSize * (this.pageEvent.pageIndex), this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1));

  }

  isAllSelected() {
    return !this.paginatedDatasource.find(row => !this.selection.isSelected(row));
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.paginatedDatasource.forEach(row => this.selection.select(row));
  }

}

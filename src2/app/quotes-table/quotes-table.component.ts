'use strict';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data-module/data.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';

import { Pipe, PipeTransform } from '@angular/core';

import { FormControl, Validators } from '../../../node_modules/@angular/forms';
import { Subscription } from '../../../node_modules/rxjs';
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
        if ((item[filterKey] || "").toString().indexOf(filter[filterKey].value) === -1) {
          return false
        }
      }
      return true
    });
  }
}

@Component({
  selector: 'app-quotes-table',
  templateUrl: './quotes-table.component.html',
  styleUrls: ['./quotes-table.component.css']
})
export class QuotesTableComponent implements OnInit {

  @Input() editColumn: boolean;
  @Input() selectQuotes: boolean;
  @Output() editQuote = new EventEmitter<Quote>();
  @Output() selectedQuotes = new EventEmitter<Quote[]>();

  dataSource: any[] = [];
  paginatedDatasource: Quote[];
  authors: any[] = [];
  filterArgs = {};
  dsPipe = new DatasourceFilterPipe;

  subs = new Subscription();

  selection = new SelectionModel<Quote>(true, []);

  pageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0
  };

  displayedColumns = ['quote', 'author', 'source', 'tags', 'playlists'];


  constructor(private data: DataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {

    this.subs.add(data.allQuotes.subscribe(x => {
      this.dataSource = x;
      this.updateDatasource();
    }));
  }

  ngOnInit() {
    if (this.editColumn) {
      this.displayedColumns = [...this.displayedColumns, 'edit']
    }

    if (this.selectQuotes) {
      this.displayedColumns = ['select', ...this.displayedColumns]
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  handlePageEvent(event) {
    this.pageEvent = event;
    this.updateDatasource();
  }

  emitSelectedQuotes() {
    this.selectedQuotes.emit(this.selection.selected)
  }

  updateDatasource() {
    this.paginatedDatasource = this.dsPipe
      .transform(this.dataSource, this.filterArgs)
      .slice(this.pageEvent.pageSize * (this.pageEvent.pageIndex),
        this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1));
  }
  
  edit(element): void {
    this.editQuote.emit(element)
  }

  delete(element): void {
    let dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      width: '500px',
      data: { element: element }
    });

    this.subs.add(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        element.deleteInProgress = true;
        this.data.deleteQuote(element)
          .then(() => element.deleteInProgress = false)
          .catch((error) => {
            element.deleteInProgress = false;
            this.snackBar.open(error, "QuoteNotDeleted", { duration: 2000 });
          })
      }

      console.log('The dialog was closed');
    }));
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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

  sortingChanged(event) {
    if (event.direction === "asc") {
      this.paginatedDatasource = this.dsPipe
        .transform(this.dataSource, this.filterArgs)
        .sort((a, b) => {
          a[event.active] = a[event.active] ? a[event.active] : '';
          b[event.active] = b[event.active] ? b[event.active] : '';
          
          return (a[event.active] > b[event.active]) ? 1 : ((b[event.active] > a[event.active]) ? -1 : 0)
        })
        .reverse()
        .slice(this.pageEvent.pageSize * (this.pageEvent.pageIndex), this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1));
    } else {
      this.paginatedDatasource = this.dsPipe
        .transform(this.dataSource, this.filterArgs)
        .sort((a, b) => {
          a[event.active] = a[event.active] !== '' ? a[event.active] : null;
          b[event.active] = b[event.active] !== '' ? b[event.active] : null;
          return (a[event.active] > b[event.active]) ? 1 : ((b[event.active] > a[event.active]) ? -1 : 0)
        })
        .slice(this.pageEvent.pageSize * (this.pageEvent.pageIndex), this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1));
    }
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

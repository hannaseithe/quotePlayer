import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data-module/data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';


import { Pipe, PipeTransform } from '@angular/core';

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
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css']
})
export class AllQuotesComponent implements OnInit {

  dataSource: Quote[] = [];
  paginatedDatasource: Quote[];
  authors: any[] = [];
  editElement: Quote; /* = {
    quote: '',
    author: '',
    source: '',
    tags:[],
    playlists: []
  }; */
  filterArgs = {};
  dsPipe = new DatasourceFilterPipe;
  pageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0
  };

  displayedColumns = ['quote', 'author', 'source', 'tags', 'playlists', 'edit'];

  constructor(private data: DataService,
    public dialog: MatDialog) {
    data.allQuotes.subscribe(x => {
      this.dataSource = x;
      this.updateDatasource();
    });
    data.allAuthors.subscribe(x => this.authors = x);
  }

  ngOnInit() {
  }


  getAuthors(): void {

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
  edit(element): void {
    this.editElement = element;
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

  applyFilter(field: string, value: string) {
    this.filterArgs[field] = {
      value: value.trim(),
      field: field
    }
    this.paginatedDatasource = this.dsPipe
    .transform(this.dataSource, this.filterArgs)
    .slice(this.pageEvent.pageSize * (this.pageEvent.pageIndex), this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1));

  }
}

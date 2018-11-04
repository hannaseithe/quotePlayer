'use strict';
import { Component, OnInit } from '@angular/core';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data-module/data.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';

import { Pipe, PipeTransform } from '@angular/core';

import * as XLSX from 'xlsx';
import { FormControl, Validators } from '../../../node_modules/@angular/forms';
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
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css']
})
export class AllQuotesComponent implements OnInit {

  editElement: Quote;

  subs = new Subscription();

  excelFile = new FormControl(null, [Validators.required]);

  panelOpenState = false;
  importInProgress = false;

  constructor(private data: DataService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  setEditQuote(event) {
    this.panelOpenState = true;
    this.editElement = event;
  }

  checkAndSaveParsedData(parsedData) {
    try {
      if (Object.keys(parsedData[0]).length > 4) { throw 'The table contains more than 4 columns' };
      if (Object.keys(parsedData[0]).length < 4) { throw 'The table contains less than 4 columns' };
      if (!parsedData[0].hasOwnProperty('quote')) { throw 'The table is missing the column >quote<' };
      if (!parsedData[0].hasOwnProperty('author')) { throw 'The table is missing the column >author<' };
      if (!parsedData[0].hasOwnProperty('source')) { throw 'The table is missing the column >source<' };
      if (!parsedData[0].hasOwnProperty('tags')) { throw 'The table is missing the column >tags<' };
      if (!!parsedData.find(x => {
        return !x.quote ? true : x.quote === '' ? true : false; 
      })) { throw 'The table contains at least one row where >quote< is empty!' };

      this.data.saveQuotes(parsedData as any)
        .then(() => {
          this.importInProgress = false;
          this.excelFile.reset();
        })
        .catch(error => {
          this.snackBar.open(error, "File not Imported", { duration: 2000 });
          this.importInProgress = false;
          this.excelFile.setErrors({ incorrect: true });
        });
    }
    catch (error) {
      this.snackBar.open(error, "File not Imported", { duration: 2000 });
      this.importInProgress = false;
      this.excelFile.setErrors({ incorrect: true });
    }
  }

  importExcel() {
    this.importInProgress = true;
    if (this.excelFile.value.files && this.excelFile.value.files[0]) {
      var req = new XMLHttpRequest();
      let file = this.excelFile.value.files[0];
      var reader = new FileReader();

      reader.onload = (e: any) => {
        let url = e.target.result;

        req.open("GET", url, true);
        req.responseType = "arraybuffer";

        req.onload = (e) => {
          var data = new Uint8Array(req.response);
          var workbook = XLSX.read(data, { type: "array" });

          const wsname: string = workbook.SheetNames[0];
          const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

          let wbData = (XLSX.utils.sheet_to_json(ws, { defval: null }));
          let parsedData = wbData.map((x: any) => {
            x.tags = x.tags ? x.tags.split(", ") : null;
            return x
          })

          this.checkAndSaveParsedData(parsedData);
        }
        req.send();
      }
      reader.readAsDataURL(file);
    }



  }
}

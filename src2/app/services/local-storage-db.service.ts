/// <reference types="../localstoragedb/localStorageDB"/>

import { Injectable } from '@angular/core';
import { DataSourceService } from '../data-model/data-source.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Quote } from '../../../src/app/data-model/quote.model';

@Injectable()
export class LocalStorageDbService implements DataSourceService {
  private lib: any;

  constructor() {
    this.lib = new localStorageDB('library', 'localStorage');
    if (this.lib.isNew()) {

      var rows = [
        {
          "quote": "Schönheit ist nie etwas rein äußerliches",
          "author": "John O'Donohue",
          "source": "Schönheit"
        },
        {
          "quote": "Sich die Zeit nehmen, um wirklich dort zu sein, wo man gerade ist",
          "author": "John O'Donohue",
          "source": "Schönheit"
        },
        {
          "quote": "Eine ehrfürchtige Annäherung erzeugt Tiefe",
          "author": "John O'Donohue",
          "source": "Schönheit"
        }
      ];

      // create the "books" table
      this.lib.createTableWithData("quotes", rows);

      // commit the database to localStorage
      // all create/drop/insert/update/delete operations should be committed
      this.lib.commit();
    }
    this.currentQuotes = new BehaviorSubject(this.lib.queryAll('quotes')); 
  }

  

  // Check if the database was just created. Useful for initial database setup


  currentQuotes: BehaviorSubject<Array<Quote>>;  

  saveQuote(formElements) {
    var quoteText = formElements.text;
    var quoteAuthor = formElements.author;
    var quoteSource = formElements.source;

    if (quoteText) {
      this.lib.insert("quotes", { quote: quoteText, author: quoteAuthor, source: quoteSource });
      this.lib.commit();
      this.currentQuotes.next(this.lib.queryAll('quotes'));
    }

  }

  getCurrentQuotes() {
    return this.lib.queryAll('quotes')
  }

}

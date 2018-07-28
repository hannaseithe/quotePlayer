/// <reference types="../localstoragedb/localStorageDB"/>

import { Injectable } from '@angular/core';
import { DataSourceService } from '../data-model/data-source.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Quote } from '../data-model/quote.model';
import { Playlist } from '../data-model/playlist.model';

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
          "source": "Schönheit",
          "id": "1"
        },
        {
          "quote": "Sich die Zeit nehmen, um wirklich dort zu sein, wo man gerade ist",
          "author": "John O'Donohue",
          "source": "Schönheit",
          "id": "2"
        },
        {
          "quote": "Eine ehrfürchtige Annäherung erzeugt Tiefe",
          "author": "John O'Donohue",
          "source": "Schönheit",
          "id": "3"
        }
      ];

      // create the "books" table
      this.lib.createTableWithData("quotes", rows);

      // commit the database to localStorage
      // all create/drop/insert/update/delete operations should be committed
      this.lib.commit();
    }
    this.currentQuotes = new BehaviorSubject(this.lib.queryAll('quotes'));
    this.allQuotes = new BehaviorSubject(this.lib.queryAll('quotes'));
  }



  // Check if the database was just created. Useful for initial database setup


  currentQuotes: BehaviorSubject<Array<Quote>>;
  allQuotes: BehaviorSubject<Array<Quote>>;
  allAuthors: BehaviorSubject<Array<any>>;
  allPlaylists: BehaviorSubject<Array<Playlist>>;

  saveQuoteWithAuthor(formElements): Promise<any> {
    var quoteText = formElements.quote;
    var quoteAuthor = formElements.author;
    var quoteSource = formElements.source;

    return new Promise((resolve, reject) => {
      if (quoteText) {
        const newID = this.lib.insert("quotes", { quote: quoteText, author: quoteAuthor, source: quoteSource });
        const result = this.lib.commit();
        this.currentQuotes.next(this.lib.queryAll('quotes'));
        this.allQuotes.next(this.lib.queryAll('quotes'));
        result ? resolve({ ID: newID }) : reject({ msg: 'Failed to save quote' });
      } else {
        reject('Could not save Quote, no quoteText provided')
      }
    })



  }

  updateQuoteWithAuthor(formElements): Promise<any> {
    return new Promise((resolve, reject) => {
      if (formElements.quote) {
        this.lib.update("quotes", { ID: formElements.ID }, function (row) {
          row.quote = formElements.quote;
          row.author = formElements.author;
          row.source = formElements.source;
          return row;
        });
        const result = this.lib.commit();
        this.currentQuotes.next(this.lib.queryAll('quotes'));
        this.allQuotes.next(this.lib.queryAll('quotes'));
        result ? resolve({ ID: formElements.ID }) : reject({ msg: "Failed to update quote with ID: " + formElements.ID });
      } else {
        reject({ msg: "Could not update, no Quotetext provided" });
      }
    });


  }

  deleteQuote(quote): Promise<any> {
    return new Promise((resolve, reject) => {
      this.lib.deleteRows("quotes", { ID: quote.ID });
      const result = this.lib.commit();
      this.currentQuotes.next(this.lib.queryAll('quotes'));
      this.allQuotes.next(this.lib.queryAll('quotes'));
      result ? resolve({ ID: quote.ID }) : reject({ msg: "Failed to delet quote with ID: " + quote.ID });
    
    })
  }

  updatePlaylist(){}
  savePlaylist() {}
  deletePlaylist() {}

}

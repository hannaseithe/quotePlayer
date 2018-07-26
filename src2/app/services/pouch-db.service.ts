import { Injectable } from '@angular/core';
import { DataSourceService } from '../data-model/data-source.model';
import { BehaviorSubject } from '../../../node_modules/rxjs/BehaviorSubject';
import { Quote } from '../data-model/quote.model';
import PouchDB from "pouchdb";
import plugin from "pouchdb-find";
import { Playlist } from '../data-model/playlist.model';

declare global {
  interface StorageEstimate {
    quota: number;
    usage: number;
  }
  interface Navigator {
    storage: {
      estimate: () => Promise<StorageEstimate>;
      persist: () => Promise<boolean>;
      persisted: () => boolean;
    };
  }
}

declare function emit(key: any): void; declare function emit(key: any, value: any): void;

@Injectable()
export class PouchDbService implements DataSourceService {

  private db: any;
  currentQuotes: BehaviorSubject<Quote[]> = new BehaviorSubject([]);
  allQuotes: BehaviorSubject<Quote[]> = new BehaviorSubject([]);
  allAuthors: BehaviorSubject<any[]> = new BehaviorSubject([]);
  allPlaylists: BehaviorSubject<Playlist[]> = new BehaviorSubject([]);

  constructor() {

  }

  init() {
    return navigator.storage.persist()
    .then(() => {
      this.db = new PouchDB('quote_database');
      PouchDB.plugin(plugin);
      this.db.changes({
        since: 'now',
        live: true
      }).on('change', function (change) {
        switch (change.doc.type) {
          case 'quote':
            this.getAllQuotes()
            break;
          case 'author':
            this.getAllAuthors()
            break;
          case 'playlist':
            this.getAllPlaylist()
            break;
          default:

        }
      }).on('error', function (err) {
        console.log(err)
      })
      return this.db.info()
    })
      .then((details) => {
        if (details.doc_count == 0 && details.update_seq == 0) {
          return this.addFirstQuote()
            .then((result) => this.addFirstPlaylist(result.id))
        } else {
          return this.getAllQuotes()
          .then(() => this.getAllPlaylists())
        }
      })

  }

  private addFirstPlaylist(quoteID) {

    const firstPlaylist = {
      _id: "My Playlist",
      quotes: [
        quoteID
      ]
    }

    return this.savePlaylist(firstPlaylist)
  }

  private addFirstQuote() {

    const firstQuote: Quote = {
      quote: "Sich die Zeit nehmen, um wirklich dort zu sein, wo man gerade ist",
      author: "John O'Donohue",
      source: "Beauty",
      tags: ["celtic spirituality"],
      playlists: []
    }

    return this.saveQuote(firstQuote)
  }

  private getAllQuotes() {
    // create a design doc
    var ddoc = {
      _id: '_design/getAllQuotes',
      views: {
        index: {
          map: function (doc) {
            if (doc.type == 'playlist') {
              for (var i in doc.quotes) {
                emit([doc.quotes[i], 1], doc);
              }
            } else if (doc.type == 'quote') {
              emit([doc._id, 0], doc);
            }
          }.toString()
        }
      }
    }

    // save the design doc
    return this.db.put(ddoc).catch(function (err) {
      if (err.name !== 'conflict') {
        throw err;
      }
      // ignore if doc already exists
    }).then(() => {
      // find docs where title === 'Lisa Says'
      return this.db.query('getAllQuotes/index', {
        include_docs: true
      });
    }).then((result) => {

      let index = 0;
      let quoteDocs = result.rows
        .map((row, i, rows) => {
          if (row.key[1] === 0) {
            index = i;
            row.doc.playlists = [];
            return row
          } else {
            rows[index].doc.playlists.push(row.id)
            return row
          }
        })
        .filter(row => {
          return row.key[1] === 0
        })
        .map(row => {
          row.doc.ID = row.doc._id;
          return row.doc
        })

      this.currentQuotes.next(quoteDocs);
      this.allQuotes.next(quoteDocs);
      return Promise.resolve()
    }).catch(function (err) {
      console.log("ERROR in getAllQuotes", err);
    });
  }

  private getAllPlaylists() {
    // create a design doc
    var ddoc = {
      _id: '_design/getAllPlaylists',
      views: {
        index: {
          map: function (doc) {
            if (doc.type == 'playlist') {
              for (var i in doc.quotes) {
                emit([doc.quotes[i], 0], doc);
              }
            } else if (doc.type == 'quote') {
              emit([doc._id, 1], doc);
            }
          }.toString()
        }
      }
    }

    // save the design doc
    return this.db.put(ddoc).catch(function (err) {
      if (err.name !== 'conflict') {
        throw err;
      }
      // ignore if doc already exists
    }).then(() => {
      // find docs where title === 'Lisa Says'
      return this.db.query('getAllPlaylists/index', {
        include_docs: true
      });
    }).then((result) => {

      let index = 0;
      let playlistDocs = result.rows
        .map((row, i, rows) => {
          if (row.key[1] === 0) {
            index = i;
            row.doc.quotes = [];
            return row
          } else {
            rows[index].doc.quotes.push(row.doc)
            return row
          }
        })
        .filter(row => {
          return row.key[1] === 0
        })
        .map(row => {
          row.doc.ID = row.doc._id;
          return row.doc
        })

      this.allPlaylists.next(playlistDocs);
      return Promise.resolve()
    }).catch(function (err) {
      console.log("ERROR in getAllPlaylists", err);
    });
  }

  private getAllAuthors() {
    return this.db.createIndex({
      index: { fields: ['type'] }
    })
      .then(() => {
        return this.db.find({
          selector: {
            type: 'author'
          }
        });
      })
      .then((result) => {
        this.allAuthors.next(result.docs);
        return Promise.resolve()
      })
  }

  saveQuote(quote: Quote) {
    let result;

    return this.saveAuthor({ "_id": quote.author }, quote.source)
      .then((response) => {
        return this.addQuote({
          "quote": quote.quote,
          "author": quote.author,
          "source": quote.source,
          "tags": quote.tags
        })
      })
      .then((res) => {
        result = res;
        return this.getAllQuotes()
      })
      .then(() => Promise.resolve(result))
  }


  private saveDoc(doc) {
    return this.db.post(doc);
  }

  private addQuote(quote) {
    quote.type = "quote";
    return this.saveDoc(quote);
  }
  private saveAuthor(author, source) {
    author.type = "author";
    author.sources = [source];

    return this.db.get(author._id)
      .then((result) => {
        result.sources.push(source);
        return this.saveDoc(result)
      }).catch((err) => {
        return this.saveDoc(author)
      })
      .then(() => this.getAllAuthors());
  }
  private saveTag(tag) {
    tag.type = "tag";
    return this.saveDoc(tag);
  }
  private saveSource(source) {
    source.type = "source";
    return this.saveDoc(source);
  }
  private savePlaylist(playlist) {
    playlist.type = "playlist";
    return this.saveDoc(playlist);
  }

  updateQuote(quote: Quote) {
    let result;

    return this.saveAuthor({ "_id": quote.author }, quote.source)
      .then((response) => {
        return this.db.get(quote.ID)
      })
      .then((result) => {
        return this.addQuote({
          "_id": quote.ID,
          "_rev": result._rev,
          "quote": quote.quote,
          "author": quote.author,
          "source": quote.source,
          "tags": quote.tags
        })
      })
      .then((res) => {
        result = res;
        return this.getAllQuotes()
      })
      .then(() => Promise.resolve(result))
  }

  deleteQuote(quote) {
    return this.db.get(quote.ID)
      .then((result) => this.db.remove(result));
  }





}

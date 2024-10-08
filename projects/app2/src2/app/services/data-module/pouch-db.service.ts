import { Injectable } from '@angular/core';
import { DataSourceService } from '../../data-model/data-source.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Quote } from '../../data-model/quote.model';
import PouchDB from "pouchdb";
import plugin from "pouchdb-find";
import debugPlugin from "pouchdb-debug";
import { Playlist } from '../../data-model/playlist.model';



declare global {
  interface Navigator {
    storage: {
      estimate: () => Promise<any>;
      persist: () => Promise<boolean>;
      persisted: () => boolean;
    };
  }
}


declare function emit(key: any): void; declare function emit(key: any, value: any): void;

@Injectable()
export class PouchDbService implements DataSourceService {

  private db: any;
  PouchDB;
  currentQuotes: BehaviorSubject<Quote[]> = new BehaviorSubject([]);
  allQuotes: BehaviorSubject<Quote[]> = new BehaviorSubject([]);
  allAuthors: BehaviorSubject<any[]> = new BehaviorSubject([]);
  allPlaylists: BehaviorSubject<Playlist[]> = new BehaviorSubject([]);

  constructor() {
    this.PouchDB = PouchDB;
  }

  mock(pouchDB, findPlugin, debugPlugin) {
    this.PouchDB = pouchDB || PouchDB;
  }

  init() {
    return navigator.storage.persist()
      .then(() => {
        this.db = new this.PouchDB('quote_database');
        this.PouchDB.plugin(plugin);
/*         this.PouchDB.plugin(debugPlugin); */
       /*  this.PouchDB.debug.enable('*'); */
        this.db.changes({
          since: 'now',
          live: true,
          include_docs: true
        })
          .on('change', (change) => {
            if (change.doc.type) {
              switch (change.doc.type) {
                case 'quote':
                  this.getAllQuotes();
                  this.getAllPlaylists();
                  break;
                case 'author':
                  this.getAllAuthors()
                  break;
                case 'playlist':
                  this.getAllPlaylists();
                  this.getAllQuotes();
                  break;
                default:
              }
            } else {
              this.getAllQuotes();
              this.getAllAuthors();
              this.getAllPlaylists()
            }

          })
          .on('error', function (err) {
            console.error(err)
          })
        return this.db.info()

      })
      .then((details) => {
        if (details.doc_count == 0 && details.update_seq == 0) {
          return this.addFirstQuote()
            .then((result) => {
              return this.addFirstPlaylist(result.id)
            })
        } else {
          return this.getAllQuotes()
            .then(() => this.getAllPlaylists())
        }
      })



  }

  saveQuoteWithAuthor(quote: Quote) {
    let result;
    return this.saveAndUpdateAuthorWithSource({ "_id": quote.author }, quote.source)
      .then(() => {
        return this.saveAndUpdateQuote(quote)
      })
  }

  updateQuoteWithAuthor(quote: Quote) {
    let result;
    return this.saveAndUpdateAuthorWithSource({ "_id": quote.author }, quote.source)
      .then(() => {
        return this.saveAndUpdateQuote(quote)
      })
  }

  deleteQuote(quote) {
    return this.deleteQuoteFromPlaylists(quote)
      .then(() => this.db.get(quote.ID))
      .then((result) => this.db.remove(result))
  }

  saveQuotes(quotes) {
    let error = false;
    let mappedQuotes = quotes.map(x => {
      x.type = "quote";
      error = x.quote ? error : true;
      return x
    });
    if (!error) {
      return this.db.bulkDocs(mappedQuotes);
    } else {
      return Promise.reject('Quotes not saved: There was at least one row where the column >quote< was not filled in')
    }

  }

  savePlaylist(playlist: Playlist) {
    if (playlist.name) {
      return this.saveAndUpdateDoc({
        "name": playlist.name,
        "quotes": playlist.quotes,
        "type": "playlist"
      });
    } else {
      return Promise.reject('Playlist not saved: The Playlist Name was empty')
    }

  }

  updatePlaylist(playlist) {
    return this.db.get(playlist.ID)
      .then((result) => {
        return this.saveAndUpdateDoc({
          "_id": playlist.ID,
          "_rev": result._rev,
          "name": playlist.name,
          "quotes": playlist.quotes,
          "type": "playlist"
        })
      })
  }

  deletePlaylist(playlist) {
    return this.db.get(playlist.ID)
      .then((result) => this.db.remove(result));
  }

  deleteQuoteFromPlaylist(playlist, index) {
    playlist.quotes.splice(index, 1);
    return this.updatePlaylist(this.mapDoc(playlist))
  }


  private addFirstPlaylist(quoteID) {

    const firstPlaylist = {
      name: "My Playlist",
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

    return this.saveQuoteWithAuthor(firstQuote)
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
      return this.db.query('getAllQuotes/index', {
        include_docs: true
      });
    }).then((result) => {
      this.allQuotes.next(this.structureQuotes(result));
      return Promise.resolve()
    }).catch(function (err) {
      console.error("ERROR in getAllQuotes", err);
    });
  }

  structureQuotes(result) {
    let index = -1;
    let quoteDocs = result.rows
      .map((row, i, rows) => {
        row.doc = this.mapDoc(row.doc);
        if (row.key[1] === 0) {
          index = i;
          row.doc.playlists = [];
          return row
        } else {
          rows[index].doc.playlists.push(row.doc.name)
          return row
        }
      })
      .filter(row => {
        return row.key[1] === 0
      })
      .map(row => {
        return row.doc
      })
    quoteDocs.sort((a, b) => (a.quote > b.quote) ? 1 : ((b.quote > a.quote) ? -1 : 0));
    return quoteDocs
  }

  private getAllPlaylists() {
    var ddoc = {
      _id: '_design/getAllPlaylists',
      views: {
        index: {
          map: function (doc) {
            if (doc.type == 'playlist') {
              emit([doc._id, 0], null);
              for (var i in doc.quotes) {
                emit([doc._id, i + 1], { _id: doc.quotes[i] });
              }
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
      return this.db.query('getAllPlaylists/index', {
        include_docs: true
      });
    }).then((result) => {

      this.allPlaylists.next(this.structurePlaylists(result));
      return Promise.resolve()
    }).catch(function (err) {
      console.error("ERROR in getAllPlaylists", err);
    });
  }

  structurePlaylists(result) {
    let index = -1;
    let playlistDocs = result.rows
      .map((row, i, rows) => {
        row.doc = this.mapDoc(row.doc);
        if (row.key[1] === 0) {
          index = i;
          row.doc.quoteDocs = [];
          return row
        } else {
          if (index > -1) {
            var quoteIndex;
            for (let i = 0; i < rows.length; i++) {
              if (rows[index].doc.quotes[i] === row.doc._id && !rows[index].doc.quoteDocs[i]) quoteIndex = i;
            }

            rows[index].doc.quoteDocs[quoteIndex] = (this.mapDoc(row.doc))
          }
          return row
        }
      })
      .filter(row => {
        return row.key[1] === 0
      })
      .map(row => {
        return row.doc
      })
      return playlistDocs
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
        let mappedResult = result.docs.map(d => this.mapDoc(d));
        this.allAuthors.next(result.docs);
        return Promise.resolve()
      })
  }

  private saveAndUpdateQuote(quote: Quote) {
    if (quote.quote) {
      return this.saveAndUpdateDoc({
        "_id": quote.ID ? quote.ID : null,
        "quote": quote.quote,
        "author": quote.author,
        "source": quote.source,
        "tags": quote.tags,
        "type": "quote"
      });
    } else {
      return Promise.reject('Quote not saved/updated: The Quote Name was empty')
    }

  }

  private saveAndUpdateAuthorWithSource(author, source) {
    author.type = "author";
    author.sources = [source];

    return this.db.get(author._id)
      .then((result) => {
        result.sources.push(source);
        return this.saveAndUpdateDoc(result)
      }).catch((err) => {
        return this.saveAndUpdateDoc(author)
      })
  }

  private deleteQuoteFromPlaylists(quote: any) {

    var ddoc = {
      _id: '_design/getAllPlaylistsThatContainQuote',
      views: {
        index: {
          map: function (doc) {
            if (doc.type == 'playlist') {
              for (let i in doc.quotes) {
                emit(doc.quotes[i], null);
              }
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
      return this.db.query('getAllPlaylistsThatContainQuote/index', {
        key: quote.ID,
        include_docs: true
      });
    }).then((result) => {
      let promiseArray = [];
      result.rows.forEach(element => {
        element.doc.quotes = this.removeFromArray(element.doc.quotes, quote.ID);
        promiseArray.push(this.updatePlaylist(this.mapDoc(element.doc)));
      });
      return Promise.all(promiseArray)
    }).catch(function (err) {
      console.error("ERROR in deleteQuoteFromPlaylists", err);
    });
  }

  private mapDoc(doc) {
    if (!doc.ID) {
      doc.ID = doc._id ? doc._id : doc.id;
    }
    return doc;
  }

  private removeFromArray(array, element) {
    let ax;
    while ((ax = array.indexOf(element)) !== -1) {
      array.splice(ax, 1);
    }
    return array;
  }


  private saveAndUpdateDoc(doc) {
    if (!doc._id) {
      doc._id = new Date().toISOString();
      return this.db.put(doc);
    } else {
      return this.db.get(doc._id)
        .then((result) => {
          doc._rev = result._rev;
          return this.db.put(doc)
        })
        .catch((err) => this.db.put(doc))
    }
  }

}

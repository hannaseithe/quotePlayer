import { Injectable } from '@angular/core';

import { DataSourceService } from '../data-model/data-source.model';
import { Quote } from '../data-model/quote.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Playlist } from '../data-model/playlist.model';

@Injectable()
export class DataService {

  private dataSource: DataSourceService;

  constructor() {
    
   }

  currentQuotes: BehaviorSubject<Quote[]>; 
  allQuotes: BehaviorSubject<Quote[]>;
  allAuthors: BehaviorSubject<any[]>;
  allPlaylists: BehaviorSubject<Playlist[]>;

  init(dataSource: DataSourceService) {
    this.dataSource = dataSource;
    this.currentQuotes = this.dataSource.currentQuotes; 
    this.allQuotes = this.dataSource.allQuotes;
    this.allAuthors = this.dataSource.allAuthors;
    this.allPlaylists = this.dataSource.allPlaylists;
  }

  saveOrUpdateQuote(quote:Quote):Promise<any> {
    if (quote.ID) {
      return this.dataSource.updateQuoteWithAuthor(quote)
    } else {
      return this.dataSource.saveQuoteWithAuthor(quote)
    }
  }

  saveOrUpdatePlaylist(playlist: Playlist):Promise<any> {
    if (playlist.ID) {
      return this.dataSource.updatePlaylist(playlist)
    } else {
      return this.dataSource.savePlaylist(playlist)
    }
  }

  getQuote(id: string) {
    return this.allQuotes.getValue()
    .find((element) => element.ID === id)
  }

  deleteQuote(quote:Quote):Promise<any> {
    return this.dataSource.deleteQuote(quote)
  }

  deletePlaylist(playlist:Playlist):Promise<any> {
    return this.dataSource.deletePlaylist(playlist)
  }

  deleteQuoteFromPlaylist(playlist, index) {
    return this.dataSource.deleteQuoteFromPlaylist(playlist,index)
  }

}

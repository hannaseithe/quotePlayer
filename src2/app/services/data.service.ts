import { Injectable } from '@angular/core';

import { DataSourceService } from '../data-model/data-source.model';
import { Quote } from '../data-model/quote.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private dataSource: DataSourceService;

  constructor() {
    
   }

  currentQuotes: BehaviorSubject<Quote[]>; 
  allQuotes: BehaviorSubject<Quote[]>;

  init(dataSource: DataSourceService) {
    this.dataSource = dataSource;
    this.currentQuotes = this.dataSource.currentQuotes; 
    this.allQuotes = this.dataSource.allQuotes;
  }

  saveOrUpdateQuote(quote:Quote):Promise<any> {
    if (quote.ID) {
      return this.dataSource.updateQuote(quote)
    } else {
      return this.dataSource.saveQuote(quote)
    }
  }

  getQuote(id: number) {
    return this.allQuotes.getValue()
    .find((element) => element.ID === id)
  }

  deleteQuote(quote:Quote):Promise<any> {
    return this.dataSource.deleteQuote(quote)
  }

}

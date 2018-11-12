/* import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { DataSourceService } from '../../data-model/data-source.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: '1', tags: [], playlists: [] };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', tags: [], playlists: [], ID: null};

class MockDataSourceService implements DataSourceService {
  getCurrentQuotes = () => {};
  saveQuote = jasmine.createSpy();
  updateQuote = jasmine.createSpy();
  deleteQuote = jasmine.createSpy();
  currentQuotes = new BehaviorSubject([]);
  allQuotes = new BehaviorSubject([testQuote1]);
  allAuthors = new BehaviorSubject([]);
};

describe('DataService', () => {
  let dataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService,
        MockDataSourceService]
    });
    dataSourceService = TestBed.get(MockDataSourceService);
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should init()', inject([DataService], (service: DataService) => {
    service.init(dataSourceService);
    expect(service.allQuotes).toEqual(dataSourceService.allQuotes);
  }));

  it('should saveOrUpdateQuote()', inject([DataService], (service: DataService) => {
    service.init(dataSourceService);
    service.saveOrUpdateQuote(testQuote1);
    expect(dataSourceService.updateQuote).toHaveBeenCalledWith(testQuote1);
    service.saveOrUpdateQuote(testQuote2);
    expect(dataSourceService.saveQuote).toHaveBeenCalledWith(testQuote2);
  }))

  it('should getQuote()', inject([DataService], (service: DataService) => {
    service.init(dataSourceService);
    let result = service.getQuote(1);
    expect(result).toEqual(testQuote1);
  }))

  it('should deleteQuote()', inject([DataService], (service: DataService) => {
    service.init(dataSourceService);
    service.deleteQuote(testQuote1);
    expect(dataSourceService.deleteQuote).toHaveBeenCalledWith(testQuote1);
  }));
});
 */
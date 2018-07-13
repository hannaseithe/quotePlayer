import { TestBed, inject } from '@angular/core/testing';

import { AppLoadService } from './app-load.service';
import { DataService } from '../services/data.service';
import { LocalStorageDbService } from '../services/local-storage-db.service';

class MockDataService {};
class MockLocalStorageDBService {};

describe('AppLoadServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLoadService,
        { provide: DataService, useClass: MockDataService },
        { provide: LocalStorageDbService, useClass: MockLocalStorageDBService }]
    });
  });

  it('should be created', inject([AppLoadService], (service: AppLoadService) => {
    expect(service).toBeTruthy();
  }));
});

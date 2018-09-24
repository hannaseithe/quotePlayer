import { TestBed, inject } from '@angular/core/testing';

import { AppLoadService } from './app-load.service';
import { DataService } from './data-module/data.service';
import { LocalStorageDbService } from './data-module/local-storage-db.service';


class MockDataService {
  init = jasmine.createSpy();
};
class MockLocalStorageDBService { };

const chrome = require('sinon-chrome');

describe('AppLoadServiceService', () => {
  let dataService, localStorageDbService, service;



  beforeAll(function () {
    (global as any).chrome = chrome;
  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [AppLoadService,
        { provide: DataService, useClass: MockDataService },
        { provide: LocalStorageDbService, useClass: MockLocalStorageDBService }]
    });
    service = TestBed.get(AppLoadService);
    dataService = TestBed.get(DataService);
    localStorageDbService = TestBed.get(LocalStorageDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should initialize the service', (done: DoneFn) => {
    const initPromise = service.init();
    initPromise.then(() => {
      expect(dataService.init).toHaveBeenCalledWith(localStorageDbService);
      done()
    })
  });
});

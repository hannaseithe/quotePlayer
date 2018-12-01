import { TestBed, inject } from '@angular/core/testing';

import { AppLoadService } from './app-load.service';
import { DataService } from './data-module/data.service';
import { PouchDbService } from './data-module/pouch-db.service';


class MockDataService {
  init = jasmine.createSpy();
};
class MockPouchDbService {
  init = () => Promise.resolve()
 };

const chrome = require('sinon-chrome');

describe('AppLoadServiceService', () => {
  let dataService, pouchDbService, service;



  beforeAll(function () {
    (global as any).chrome = chrome;
  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [AppLoadService,
        { provide: DataService, useClass: MockDataService },
        { provide: PouchDbService, useClass: MockPouchDbService }]
    });
    service = TestBed.get(AppLoadService);
    dataService = TestBed.get(DataService);
    pouchDbService = TestBed.get(PouchDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should initialize the service', (done: DoneFn) => {
    const initPromise = service.init();
    initPromise.then(() => {
      expect(dataService.init).toHaveBeenCalledWith(pouchDbService);
      done()
    })
  });
});

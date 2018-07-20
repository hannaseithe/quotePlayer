import { TestBed, inject } from '@angular/core/testing';

import { AppLoadService } from './app-load.service';
import { DataService } from '../services/data.service';
import { LocalStorageDbService } from '../services/local-storage-db.service';
import { PlayerService } from './player.service';


class MockDataService {
  init = jasmine.createSpy();
};
class MockLocalStorageDBService { };

class MockPlayerService { };

const chrome = require('sinon-chrome');

describe('AppLoadServiceService', () => {
  let dataService, localStorageDbService, service, playerService;



  beforeAll(function () {
    (global as any).chrome = chrome;
  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [AppLoadService,
        { provide: PlayerService, useClass: MockPlayerService },
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

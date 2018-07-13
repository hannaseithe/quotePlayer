import { TestBed, inject } from '@angular/core/testing';
import chrome from 'sinon-chrome'; // from 'sinon-chrome'


import { PlayerService } from './player.service';
import { DataService } from '../services/data.service';
import { ChromeMessageService } from '../services/chrome-message.service';


class MockDataService { };
class MockChromeMessageService { };

describe('PlayerService', () => {

  beforeAll(function () {
    (global as any)['chrome'] = chrome;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerService,
        { provide: DataService, useClass: MockDataService },
        { provide: ChromeMessageService, useClass: MockChromeMessageService }]
    });
  });

  it('should be created', inject([PlayerService], (service: PlayerService) => {
    expect(service).toBeTruthy();
  }));
});

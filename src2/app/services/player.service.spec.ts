import { TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { PlayerService } from './player.service';
import { DataService } from '../services/data.service';
import { ChromeMessageService } from '../services/chrome-message.service';

class MockDataService {
  currentQuotes = new BehaviorSubject([])
 };
class MockChromeMessageService { };

const chrome = require('sinon-chrome');

describe('PlayerService', () => {

  beforeAll(function () {
    Object.assign((global as any).chrome, chrome)
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

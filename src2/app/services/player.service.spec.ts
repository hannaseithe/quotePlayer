import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { PlayerService } from './player.service';
import { DataService } from '../services/data.service';

class MockDataService {
  currentQuotes = new BehaviorSubject([testQuote1])
};

const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: 1 };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: 2 };

describe('PlayerService', () => {
  let messageService, service;

  beforeAll(function () {
    (global as any).chrome.notifications = {
      onButtonClicked: {
        addListener: jasmine.createSpy()
      },
      onClosed: {
        addListener: jasmine.createSpy()
      },
      create: jasmine.createSpy(),
      clear: jasmine.createSpy()
    };
    (global as any).chrome.runtime = {
      onMessage: {
        addListener: jasmine.createSpy()
      }
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerService,
        { provide: DataService, useClass: MockDataService }]
    });
    service = TestBed.get(PlayerService);
  });

  it('should be created', inject([PlayerService], (service: PlayerService) => {
    expect(service).toBeTruthy();
    expect((global as any).chrome.notifications.onButtonClicked.addListener).toHaveBeenCalled();
    expect((global as any).chrome.notifications.onClosed.addListener).toHaveBeenCalled();
    expect((global as any).chrome.runtime.onMessage.addListener).toHaveBeenCalled();
  }));

  it('should startInterval',  fakeAsync(() => {
    const options = {
      type: "basic",
      title: "A quote by " + testQuote1.author,
      message: testQuote1.quote,
      contextMessage: "Source: " + testQuote1.source,
      buttons: [
        { title: "close" },
        { title: "stop" }
      ],
      requireInteraction: true,
      iconUrl: "../icon.png"
    };
    service.startInterval(3);
    tick(60000*3 + 1);
    expect((global as any).chrome.notifications.create).toHaveBeenCalledWith('quote0', options);
  }));

  it('should be created', inject([PlayerService], (service: PlayerService) => {
    service.stopInterval();
    expect((global as any).chrome.notifications.clear).toHaveBeenCalledWith('quote0');
  }));
});

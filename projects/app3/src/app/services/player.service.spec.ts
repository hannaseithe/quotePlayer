import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { PlayerService } from './player.service';
import { DataService } from '../../../../../src2/app/services/data-module/data.service';
import { PouchDbService } from '../../../../../src2/app/services/data-module/pouch-db.service';
import { async } from '../../../../../node_modules/@types/q';
import { doesNotThrow } from 'assert';

class MockPouchDBService {
  init = jasmine.createSpy().and.returnValue(Promise.resolve());
};
class MockDataService {
  allPlaylists = new BehaviorSubject([testPlaylist1]);
  init = jasmine.createSpy('MockDataService > init');
};

const chrome = require('sinon-chrome');

const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: 1 };
const testPlaylist1 = { ID: 'TESTID', name: 'TEST PLAYLIST', quotes: [testQuote1.ID], quoteDocs: [testQuote1] };
const mockDataUrl = 'MOCKDATAURL';
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: 2 };

fdescribe('PlayerService', () => {
  let service, pouchDb, dataService;

  beforeAll(function () {
    (global as any).chrome = chrome;
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
      },
      sendMessage: jasmine.createSpy()
    }
  });

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [PlayerService,
        { provide: DataService, useClass: MockDataService },
        { provide: PouchDbService, useClass: MockPouchDBService }]
    });
    service = TestBed.get(PlayerService);
    pouchDb = TestBed.get(PouchDbService);
    dataService = TestBed.get(DataService);
    tick();
  }));


  fit('should be created', () => {
    expect(service).toBeTruthy();
    expect(pouchDb).toBeTruthy();
    expect(dataService).toBeTruthy();

    expect((global as any).chrome.notifications.onButtonClicked.addListener).toHaveBeenCalled();
    expect((global as any).chrome.notifications.onClosed.addListener).toHaveBeenCalled();
    expect((global as any).chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    expect(pouchDb.init).toHaveBeenCalled();

    expect(dataService.init).toHaveBeenCalledWith(pouchDb);
    expect(service.state.playlists).toEqual([testPlaylist1]);

  });


  fit('should startInterval', fakeAsync(() => {
    spyOn(service, 'drawText').and.returnValue({ toDataURL: () => mockDataUrl });

    var options = {
      type: "image",
      title: "A quote by " + testQuote1.author,
      message: testQuote1.quote.substring(0, 25) + ' ...',
      contextMessage: "Source: " + testQuote1.source,
      imageUrl: mockDataUrl,
      buttons: [
        { title: "Next Quote" },
        { title: "Stop" }
      ],
      requireInteraction: true,
      iconUrl: "../iconm.png"
    };

    service.startInterval(1000, testPlaylist1);
    tick(60000 * 3 + 1);
    expect((global as any).chrome.notifications.create).toHaveBeenCalledWith('quote0', options);
    expect((global as any).chrome.runtime.sendMessage.calls.argsFor(1)).toEqual([{
      msg: "updateState", data: {
        set count(x) {
          chrome.runtime.sendMessage({ msg: "updateState", data: this });
          this.c = x
        },
        get count() { return this.c },
        c: 1,
        set running(x) {
          chrome.runtime.sendMessage({ msg: "updateState", data: this });
          this.r = x
        },
        get running() { return this.r },
        r: true,
        time: 1000,
        playlists: [testPlaylist1],
        playlist: testPlaylist1
      }
    }]);

  }));

  fit('should stopInterval', () => {


    service.stopInterval();
    expect((global as any).chrome.notifications.clear).toHaveBeenCalledWith('quote0');
    expect((global as any).chrome.runtime.sendMessage.calls.argsFor(2)).toEqual([{
      msg: "updateState", data: {
        set count(x) {
          chrome.runtime.sendMessage({ msg: "updateState", data: this });
          this.c = x
        },
        get count() { return this.c },
        c: 0,
        set running(x) {
          chrome.runtime.sendMessage({ msg: "updateState", data: this });
          this.r = x
        },
        get running() { return this.r },
        r: false,
        time: 60000,
        playlists: [testPlaylist1],
        playlist: null
      }
    }]);

  });


});

import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { PlayerService } from './player.service';
import { DataService } from '../../../app2/src2/app/services/data-module/data.service';
import { PouchDbService } from '../../../app2/src2/app/services/data-module/pouch-db.service';
import { async } from '../../../../../node_modules/@types/q';
import { doesNotThrow } from 'assert';
import { componentFactoryName } from '../../../../../node_modules/@angular/compiler';

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

describe('PlayerService', () => {
  let service: PlayerService, pouchDb, dataService;

  beforeEach(function () {
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
    };
    (global as any).chrome.browserAction = {
      setIcon: jasmine.createSpy()
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


  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(pouchDb).toBeTruthy();
    expect(dataService).toBeTruthy();

    expect(pouchDb.init).toHaveBeenCalled();
    expect(dataService.init).toHaveBeenCalledWith(pouchDb);

  });

  it('should have a listener for notification button[0]', () => {

    expect((global as any).chrome.notifications.onButtonClicked.addListener).toHaveBeenCalled();
    const callBack1 = (global as any).chrome.notifications.onButtonClicked.addListener.calls.argsFor(0)[0];
    callBack1('quote0', 0);
    expect(chrome.notifications.clear).toHaveBeenCalled();
    var options = {
      type: "basic",
      title: "No Playlist selected",
      message: "Please select a playlist to play",
      iconUrl: "../icong.png"
    };
    expect((global as any).chrome.notifications.create).toHaveBeenCalledWith('noPlaylistSelected', options);
    expect((global as any).chrome.runtime.sendMessage).not.toHaveBeenCalled();

  });

  it('should have a listener for notification button[1]', () => {
    const callBack1 = (global as any).chrome.notifications.onButtonClicked.addListener.calls.argsFor(0)[0];
    callBack1('quote0', 1);
    expect(chrome.browserAction.setIcon).toHaveBeenCalled();
    expect((global as any).chrome.notifications.clear).toHaveBeenCalledWith('quote0');
    expect((global as any).chrome.runtime.sendMessage).toHaveBeenCalled();
  });

  it('should have a listener for when notification is closed', () => {
    expect((global as any).chrome.notifications.onClosed.addListener).toHaveBeenCalled();
    const callBack2 = (global as any).chrome.notifications.onClosed.addListener.calls.argsFor(0)[0];
    callBack2('quote0');
    var options = {
      type: "basic",
      title: "No Playlist selected",
      message: "Please select a playlist to play",
      iconUrl: "../icong.png"
    };
    expect((global as any).chrome.notifications.create).toHaveBeenCalledWith('noPlaylistSelected', options);
  })


  it('shoudl have a listener when "getState" message is received', () => {
    expect((global as any).chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    const callBack3 = (global as any).chrome.runtime.onMessage.addListener.calls.argsFor(0)[0];
    const sendResponseSpy = jasmine.createSpy('sendResponse');

    callBack3({ msg: 'getState' }, undefined, sendResponseSpy);
    expect(sendResponseSpy).toHaveBeenCalledTimes(1);
  });

  it('should have a Listener when "startTimer" message is received', fakeAsync(() => {
    expect((global as any).chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    const callBack3 = (global as any).chrome.runtime.onMessage.addListener.calls.argsFor(0)[0];
    const sendResponseSpy = jasmine.createSpy('sendResponse');

    callBack3({ msg: 'startTimer', time: 60000, playlist: testPlaylist1 }, undefined, sendResponseSpy);

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

    tick(60000 * 3 + 1);

    expect((global as any).chrome.notifications.create).toHaveBeenCalledTimes(1);
    expect((global as any).chrome.notifications.create.calls.argsFor(0)[0]).toEqual('quote0');
    const optionsArg = (global as any).chrome.notifications.create.calls.argsFor(0)[1];

    expect(optionsArg.title).toBe("A quote by " + testQuote1.author);
    expect(optionsArg.message).toBe(testQuote1.quote.substring(0, 25) + ' ...');
    expect(optionsArg.contextMessage).toBe("Source: " + testQuote1.source);


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
        time: 60000,
        playlists: [testPlaylist1],
        playlist: testPlaylist1
      }
    }]);
  }));


  it('should have a Listener for when "stopTimer" message is received', () => {
    expect((global as any).chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    const callBack3 = (global as any).chrome.runtime.onMessage.addListener.calls.argsFor(0)[0];
    const sendResponseSpy = jasmine.createSpy('sendResponse');

    callBack3({ msg: 'stopTimer' }, undefined, sendResponseSpy);
    expect(sendResponseSpy).toHaveBeenCalledTimes(1);

    expect((global as any).chrome.notifications.clear).toHaveBeenCalledWith('quote0');

    expect((global as any).chrome.runtime.sendMessage.calls.argsFor(0)).toEqual([{
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
  })

});

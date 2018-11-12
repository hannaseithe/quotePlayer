import { TestBed, inject, tick, fakeAsync, flushMicrotasks, async, ComponentFixture } from '@angular/core/testing';

import { PouchDbService } from './pouch-db.service';
import { doesNotThrow } from 'assert';


class MockPouchDB {
  constructor(DBname) {
    console.log('Created with DB Name:', DBname)
  }

  static debug = {
    enable: () => { }
  }

  static plugin = () => { };

  changes = () => {
    return {
      on: () => {
        return { on: () => { } }
      }
    }
  }

  info = () => Promise.resolve({
    doc_count: 0,
    update_seq: 0
  })

  put = (value) => Promise.resolve(value);
  get = (value) => Promise.resolve(value);
  bulkDocs = (value) => Promise.resolve(value);
}

const dbQuote1 = {
  _id: '1',
  key: ['1', 0],
  doc: {
    quote: 'TEST QUOTE1', author: 'TEST AUTHOR1', source: 'TEST SOURCE1', _id: '1',
    type: 'quote'
  }
}

const dbQuote2 = {
  _id: '2',
  key: ['2', 0],
  doc: {
    quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', _id: '2',
    type: 'quote'
  }
}

const dbQuote3 = {
  _id: '3',
  key: ['3', 0],
  doc: {
    quote: 'TEST QUOTE3', author: 'TEST AUTHOR3', source: 'TEST SOURCE3', _id: '3',
    type: 'quote'
  }
}

const dbPlaylist1 = {
  _id: '4',
  key: ['', 1],
  doc: {
    name: 'PLAYLIST 1',
    type: 'playlist',
    quotes: ['1'],
    _id: '4'
  }
}

const dbPlaylist2 = {
  _id: '5',
  key: ['', 1],
  doc: {
    name: 'PLAYLIST 2',
    type: 'playlist',
    quotes: ['1', '3'],
    _id: '5'
  }
}

const testPlaylist1 = { ...dbPlaylist1.doc,
quoteDocs: [dbQuote1.doc], ID: '4'};
const testPlaylist2 = { ...dbPlaylist2.doc,
quoteDocs: [dbQuote1.doc, dbQuote3.doc], ID: '5' };

const testQuote1 = {
  ...dbQuote1.doc,
  playlists: [testPlaylist1.name, testPlaylist2.name], ID: '1'
};
const testQuote2 = {
  ...dbQuote2.doc,
  playlists: [], ID: '2'
};
const testQuote3 = {
  ...dbQuote3.doc,
  playlists: [testPlaylist2.name], ID: '3'
};
const testQuote4 = { quote: null };





fdescribe('PouchDbService', () => {
  let service;

  Object.defineProperty(window.navigator, 'storage', { value: { persist: () => Promise.resolve() } });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PouchDbService]
    });
    service = TestBed.get(PouchDbService);
    service.mock(MockPouchDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should init', fakeAsync(() => {
    spyOn(service, 'addFirstPlaylist').and.callThrough();
    service.init();
    tick();
    expect(service.addFirstPlaylist).toHaveBeenCalled();
  }));

  it('should saveQuotes', (done) => {

    service.init()
      .then(() => {
        spyOn(service.db, 'bulkDocs').and.callThrough();
        return service.saveQuotes([testQuote1, testQuote2])
      })
      .then((result) => {
        expect(service.db.bulkDocs).toHaveBeenCalled();
        done();
      })
  });

  it('should fail on saveQuotes', (done) => {
    service.init()
      .then(() => service.saveQuotes([testQuote1, testQuote2, testQuote4]))
      .catch((error) => {
        expect(error).toBe('Quotes not saved: There was at least one row where the column >quote< was not filled in');
        done();

      })
  });

  it('should structureQuotes()', () => {
    let result = service.structureQuotes({
      rows: [dbQuote1, dbPlaylist1, dbPlaylist2, dbQuote2, dbQuote3, dbPlaylist2]
    });
    expect(result).toEqual([testQuote1, testQuote2, testQuote3])
  })

  it('should structurePlaylists()', () => {
    dbPlaylist1.key[1] = 0;
    dbPlaylist2.key[1] = 0; 
    dbQuote2.key[1] = 1;
    dbQuote3.key[1] = 1;
    dbQuote1.key[1] = 1;
    let result = service.structurePlaylists({
      rows: [dbPlaylist1, dbQuote1, dbPlaylist2, dbQuote1, dbQuote3]
    });
    console.log(result);
    expect(result).toEqual([testPlaylist1, testPlaylist2])
  })


})
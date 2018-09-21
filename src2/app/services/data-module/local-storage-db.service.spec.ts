import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageDbService } from './local-storage-db.service';

const rowArray = [
  [
    {
      "quote": "Schönheit ist nie etwas rein äußerliches",
      "author": "John O'Donohue",
      "source": "Schönheit",
      "id": "1"
    },
    {
      "quote": "Sich die Zeit nehmen, um wirklich dort zu sein, wo man gerade ist",
      "author": "John O'Donohue",
      "source": "Schönheit",
      "id": "2"
    },
    {
      "quote": "Eine ehrfürchtige Annäherung erzeugt Tiefe",
      "author": "John O'Donohue",
      "source": "Schönheit",
      "id": "3"
    }
  ]
]

class MockLib {
  isNew = () => true;
  createTableWithData = (name, rows) => {};
  commit = () => {};
  queryAll = () => {return rowArray};
  insert = () => {};
  update = () => {};
  deleteRows = () => {};
}

class MockLocalStorageDB {
  constructor(name,cat){ return new MockLib()}
}

describe('LocalStorageDbService', () => {
  let service;

  beforeAll(() => {
    (global as any).localStorageDB = MockLocalStorageDB;
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageDbService]
    });
    service = TestBed.get(LocalStorageDbService)

  });

  it('should be created and allQuotes work', (done: DoneFn) => {
    expect(service).toBeTruthy();
    service.allQuotes.subscribe(x => {
      expect(x).toEqual(rowArray);
      done();
    })
  });

  it('should be created and currentQuotes work', (done: DoneFn) => {
    expect(service).toBeTruthy();
    service.currentQuotes.subscribe(x => {
      expect(x).toEqual(rowArray);
      done();
    })
  });

  it('should getC', (done: DoneFn) => {
    expect(service).toBeTruthy();
    service.currentQuotes.subscribe(x => {
      expect(x).toEqual(rowArray);
      done();
    })
  });
});

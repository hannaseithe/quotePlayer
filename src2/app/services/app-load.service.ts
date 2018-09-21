import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { DataService } from './data-module/data.service';
import { LocalStorageDbService } from './data-module/local-storage-db.service';
import { PouchDbService } from './data-module/pouch-db.service';


@Injectable()
export class AppLoadService {

  constructor(private data: DataService, private pouchDB: PouchDbService) { }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(`initializeApp:: inside promise`);

      this.pouchDB.init()
      .then(() => {
        this.data.init(this.pouchDB);
        resolve();
      })
    });
  }

}

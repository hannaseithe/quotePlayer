import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LocalStorageDbService } from './local-storage-db.service';
import { PlayerService } from './player.service';
import { PouchDbService } from './pouch-db.service';


@Injectable()
export class AppLoadService {

  constructor(private data: DataService, private pouchDB: PouchDbService,
  private player: PlayerService) { }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(`initializeApp:: inside promise`);

      this.pouchDB.init()
      .then(() => {
        this.data.init(this.pouchDB);
        this.player.init();
        resolve();
      })
    });
  }

}

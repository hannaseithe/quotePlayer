import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LocalStorageDbService } from './local-storage-db.service';
import { PlayerService } from './player.service';

@Injectable()
export class AppLoadService {

  constructor(private data: DataService, private localStorageDB: LocalStorageDbService,
  private player: PlayerService) { }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(`initializeApp:: inside promise`);

      this.data.init(this.localStorageDB);
      this.player.init();


      resolve();
    });
  }

}

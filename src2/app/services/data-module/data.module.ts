import { NgModule, ModuleWithProviders } from '@angular/core';
import { PouchDbService } from './pouch-db.service';
import { LocalStorageDbService } from './local-storage-db.service';
import { DataService } from './data.service';


@NgModule({
  declarations: [
  ],
  exports: [
  ]
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataModule,
      providers: [ PouchDbService, LocalStorageDbService, DataService ]
    };
  }
}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { SharedMaterialModule } from '../app.shared-material.module';

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule
  ],
  declarations: [ImportExcelComponent],
  entryComponents: [
    ImportExcelComponent
  ]
})
export class InfoModule { }

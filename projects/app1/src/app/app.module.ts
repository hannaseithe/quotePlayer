import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PopupComponent, DisableControlDirective } from './popup/popup.component';
import { SharedMaterialModule } from './app.shared-material.module';


@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    DisableControlDirective
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

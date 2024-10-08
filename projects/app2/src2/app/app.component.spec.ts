import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({selector: 'app-all-quotes', template: ''})
class AllQuotesStubComponent {}

class MockMatDialog { };

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        AppComponent,
        AllQuotesStubComponent
      ],
      providers: [  { provide: MatDialog, useClass: MockMatDialog }]
    }).compileComponents();
  }));
});

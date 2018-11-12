import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { QuoteDialogComponent } from './quote-dialog.component';


import { MatDialogModule, MatButtonModule, MatDialogRef, MAT_DIALOG_DATA, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatChipsModule, MatPaginatorModule, MatToolbarModule } from '@angular/material';
import { DatasourceFilterPipe } from '../all-quotes/all-quotes.component';
import { DataService } from '../services/data-module/data.service';
import { BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockMatDialogRef { };
class MockMAT_DIALOG_DATA { };

const testQuote1 = { quote: 'TEST QUOTE1', author: 'TEST AUTHOR1', source: 'TEST SOURCE1', ID: '1' };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };
const parsedQuote = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', tags: [] }

class MockDataService {
  allQuotes = new BehaviorSubject([testQuote1]);
};

@Component({selector: 'app-quote', template: ''})
class QuoteStubComponent {
  @Input() quote;
  @Output() close = new EventEmitter<boolean>();
}

describe('QuoteDialogComponent', () => {
  let component: QuoteDialogComponent;
  let fixture: ComponentFixture<QuoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteDialogComponent, QuoteStubComponent, DatasourceFilterPipe ],
      imports: [  
        NoopAnimationsModule,
        MatDialogModule, 
        MatTableModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatChipsModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatButtonModule ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useClass: MockMAT_DIALOG_DATA }
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

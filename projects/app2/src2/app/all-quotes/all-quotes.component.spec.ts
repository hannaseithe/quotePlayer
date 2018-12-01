import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { AllQuotesComponent, DatasourceFilterPipe } from './all-quotes.component';
import { DataService } from '../services/data-module/data.service';
import {   MatExpansionModule, MatFormFieldModule, MatProgressSpinnerModule, MatDividerModule, MatTooltipModule, MatChipsModule, MatPaginatorModule, MatToolbarModule, MatSnackBar, MatInputModule, MatSnackBarModule } from '@angular/material';
import {  MatIconModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialFileInputModule } from '../../../node_modules/ngx-material-file-input';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { By } from '@angular/platform-browser';
import { Quote } from '@angular/compiler';

const testQuote1 = { quote: 'TEST QUOTE1', author: 'TEST AUTHOR1', source: 'TEST SOURCE1', ID: '1' };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };
const parsedQuote = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', tags: [] }



@Component({ selector: 'app-quotes-table', template: '' })
class QuotesTableStubComponent {
}
@Component({ selector: 'app-quote', template: '' })
class QuoteStubComponent {
  @Input() quote;
}


describe('AllQuotesComponent', () => {
  let component: AllQuotesComponent;
  let fixture: ComponentFixture<AllQuotesComponent>;
  let dataService: DataService;
  let snackBar;

  class MockDataService {
    allQuotes = new BehaviorSubject([testQuote1]);
    deleteQuote = () => {
      return Promise.resolve()
        .then(() => this.allQuotes.next([]))
    };
    saveQuotes = (newQuote) => {
      this.allQuotes.next(newQuote);
      return Promise.resolve();
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatExpansionModule,
        NoopAnimationsModule,
        MaterialFileInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatTooltipModule,
        MatChipsModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatInputModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AllQuotesComponent, QuotesTableStubComponent, QuoteStubComponent, DatasourceFilterPipe],
      providers: [
        { provide: DataService, useClass: MockDataService },
        MatSnackBar]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = TestBed.get(DataService);
    snackBar = TestBed.get(MatSnackBar);

    spyOn(snackBar, 'open');
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });



  it('should edit Element', fakeAsync(() => {

    component.setEditQuote(testQuote1);
    expect(component.editElement).toEqual(testQuote1);
    expect(component.panelOpenState).toBe(true);

    fixture.detectChanges();
    let extendedPanelEl = fixture.debugElement.query(By.css('.mat-expansion-panel.mat-expanded'));
    expect(extendedPanelEl).toBeTruthy();
  
  }));

  it('should checkAndSaveParsedData()', fakeAsync(() => {
    spyOn(dataService, 'saveQuotes').and.callThrough();

    component.checkAndSaveParsedData([{ other: 'NOTHING' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table contains less than 4 columns');


    component.checkAndSaveParsedData([{ 1: 'NOTHING', 2: '', 3: '', 4: '', 5: '' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table contains more than 4 columns');

    component.checkAndSaveParsedData([{ 1: 'NOTHING', 2: '', 3: '', 4: '' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table is missing the column >quote<');

    component.checkAndSaveParsedData([{ 1: 'NOTHING', 2: '', quote: '', 4: '' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table is missing the column >author<');

    component.checkAndSaveParsedData([{ quote: 'NOTHING', 2: '', author: '', 4: '' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table is missing the column >source<');

    component.checkAndSaveParsedData([{ quote: 'NOTHING', author: '', source: '', 4: '' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table is missing the column >tags<');

    component.checkAndSaveParsedData([{ quote: null, author: '', source: '', tags: '' }]);
    expect(snackBar.open.calls.mostRecent().args[0]).toEqual('The table contains at least one row where >quote< is empty!');

    component.checkAndSaveParsedData([parsedQuote]);
    tick();
    tick();
    fixture.detectChanges();

    expect(dataService.saveQuotes).toHaveBeenCalled();

  }));
});

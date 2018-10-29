import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AllQuotesComponent, DatasourceFilterPipe } from './all-quotes.component';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { DataService } from '../services/data-module/data.service';
import { MatDialog, MatDialogRef, MatExpansionModule, MatFormFieldModule, MatProgressSpinnerModule, MatDividerModule, MatTooltipModule, MatChipsModule, MatPaginatorModule, MatToolbarModule, MatSnackBar, MatInputModule, MatSnackBarModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule, MatIconModule, MatDialogModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuoteComponent } from '../quote/quote.component';
import { MaterialFileInputModule } from '../../../node_modules/ngx-material-file-input';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { componentNeedsResolution } from '../../../node_modules/@angular/core/src/metadata/resource_loading';
import { By } from '@angular/platform-browser';
import { not } from '@angular/compiler/src/output/output_ast';

const testQuote1 = { quote: 'TEST QUOTE1', author: 'TEST AUTHOR1', source: 'TEST SOURCE1', ID: '1' };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };
const parsedQuote = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', tags: [] }


@Component({ selector: 'app-quote-dialog', template: '' })
class QuoteDialogStubComponent {
}

describe('DatasourceFilterPipe', () => {
  let pipe: DatasourceFilterPipe;

  beforeEach(() => {
    pipe = new DatasourceFilterPipe();
  });

  it('should transform', () => {
    expect(pipe.transform([testQuote1, testQuote2, testQuote1], {})).toEqual([testQuote1, testQuote2, testQuote1]);
    expect(pipe.transform([testQuote1, testQuote2, testQuote1], { author: { value: testQuote2.author } })).toEqual([testQuote2]);
    expect(pipe.transform([testQuote1, testQuote2, testQuote1], { author: { value: testQuote2.author }, source: { value: testQuote1.source } })).toEqual([]);
  })

})


describe('AllQuotesComponent', () => {
  let component: AllQuotesComponent;
  let fixture: ComponentFixture<AllQuotesComponent>;
  let dataService: DataService;
  let dialog, snackBar;

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

  class MockMatDialogService {
    open = () => {
      return {
        afterClosed: () => new BehaviorSubject([])
      }
    }
  };




  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        MatExpansionModule,
        BrowserAnimationsModule,
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
      declarations: [AllQuotesComponent, QuoteDialogStubComponent, QuoteComponent, DatasourceFilterPipe],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialog, useClass: MockMatDialogService },
        MatSnackBar]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = TestBed.get(DataService);
    dialog = TestBed.get(MatDialog);
    snackBar = TestBed.get(MatSnackBar);

    spyOn(dialog, "open").and.callThrough();
    spyOn(dataService, "deleteQuote").and.callThrough();
    spyOn(snackBar, 'open');
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
    expect(component.dataSource).toEqual([testQuote1]);
    expect(component.paginatedDatasource).toEqual([testQuote1]);
    fixture.detectChanges();

    let quoteTableEl = fixture.debugElement.query(By.css('.mat-table'));
    expect(quoteTableEl.nativeElement.textContent).toContain(testQuote1.quote);
    expect(quoteTableEl.nativeElement.textContent).toContain(testQuote1.author);
    expect(quoteTableEl.nativeElement.textContent).toContain(testQuote1.source);
  });

  it('should (not)contain Quote data after (un)publishing Quote', () => {
    let quoteTableEl = fixture.debugElement.query(By.css('.mat-table'));

    fixture.detectChanges();
    expect(quoteTableEl.nativeElement.textContent).toContain('TEST QUOTE');
    expect(quoteTableEl.nativeElement.textContent).toContain('TEST AUTHOR');
    expect(quoteTableEl.nativeElement.textContent).toContain('TEST SOURCE');


    dataService.allQuotes.next([]);
    fixture.detectChanges();
    expect(quoteTableEl.nativeElement.textContent).not.toContain('TEST QUOTE');
  });

  it('should edit Element', fakeAsync(() => {

    component.edit(testQuote1);
    expect(component.editElement).toEqual(testQuote1);
    expect(component.panelOpenState).toBe(true);
  }));

  it('should attempt to open check delete Dialog', fakeAsync(() => {
    let dialogElement = document.getElementsByClassName('.mat-dialog-container')[0];
    expect(dialogElement).not.toBeDefined();

    component.delete(component.dataSource[0]);
    fixture.detectChanges();
    expect(dialog.open).toHaveBeenCalledWith(CheckDeleteDialogComponent, {
      width: '500px',
      data: { element: testQuote1 }
    });
    expect(dataService.deleteQuote).toHaveBeenCalledWith(testQuote1);

    expect(component.dataSource[0].deleteInProgress).toBe(true);

    tick();
    fixture.detectChanges();
    expect(component.dataSource).toEqual([]);
    let quoteTableEl = fixture.debugElement.query(By.css('.mat-table'));
    expect(quoteTableEl.nativeElement.textContent).not.toContain(testQuote1.quote);
    expect(quoteTableEl.nativeElement.textContent).not.toContain(testQuote1.author);
    expect(quoteTableEl.nativeElement.textContent).not.toContain(testQuote1.source);
  }));

  it('should updateDatasource()', () => {
    component.dataSource = [testQuote1, testQuote2, testQuote1, testQuote2, testQuote1, testQuote2];
    component.updateDatasource();
    expect(component.paginatedDatasource).toEqual([testQuote1, testQuote2, testQuote1, testQuote2, testQuote1]);

    component.pageEvent.pageIndex = 1;
    component.dataSource = [testQuote1, testQuote2, testQuote1, testQuote2, testQuote1, testQuote2];
    component.updateDatasource();
    expect(component.paginatedDatasource).toEqual([testQuote2]);

  });

  it('should applyFilter()', () => {
    component.dataSource = [testQuote1, testQuote2, testQuote1, testQuote2, testQuote1, testQuote2];
    component.applyFilter('source', testQuote2.source);
    expect(component.paginatedDatasource).toEqual([testQuote2, testQuote2, testQuote2]);

    component.applyFilter('source', 'lksjf');
    expect(component.paginatedDatasource).toEqual([]);
  });

  it('should sortingChanged()', () => {
    component.dataSource = [testQuote1, testQuote2, testQuote1, testQuote2, testQuote1, testQuote2];
    const event1 = {
      direction: 'asc',
      active: 'author'
    }
    const event2 = {
      direction: 'dsc',
      active: 'author'
    }

    component.sortingChanged(event1);
    expect(component.paginatedDatasource).toEqual([testQuote2, testQuote2, testQuote2, testQuote1, testQuote1]);

    component.sortingChanged(event2);
    expect(component.paginatedDatasource).toEqual([testQuote1, testQuote1, testQuote1, testQuote2, testQuote2]);
  });

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

    let quoteTableEl = fixture.debugElement.query(By.css('.mat-table'));
    expect(quoteTableEl.nativeElement.textContent).toContain(testQuote2.quote);
    expect(quoteTableEl.nativeElement.textContent).toContain(testQuote2.author);
    expect(quoteTableEl.nativeElement.textContent).toContain(testQuote2.source);

  }));
});

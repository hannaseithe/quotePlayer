import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QuotesTableComponent, DatasourceFilterPipe } from './quotes-table.component';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatProgressSpinnerModule, MatDividerModule, MatTooltipModule, MatChipsModule, MatPaginatorModule, MatToolbarModule, MatInputModule, MatDialog, MatSnackBar, MatSnackBarModule, MatCheckboxModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data-module/data.service';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { Component } from '@angular/core';

const testQuote1 = { quote: 'TEST QUOTE1', author: 'TEST AUTHOR1', source: 'TEST SOURCE1', ID: '1' };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };
const parsedQuote = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', tags: [] }

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

@Component({ selector: 'app-quote-dialog', template: '' })
class QuoteDialogStubComponent {
}

describe('QuotesTableComponent', () => {
  let component: QuotesTableComponent;
  let fixture: ComponentFixture<QuotesTableComponent>;
  let dataService, dialog;

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
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [QuotesTableComponent, QuoteDialogStubComponent, DatasourceFilterPipe],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialog, useClass: MockMatDialogService },
        MatSnackBar]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = TestBed.get(DataService);
    dialog = TestBed.get(MatDialog);

    spyOn(dialog, "open").and.callThrough();
    spyOn(dataService,'deleteQuote').and.callThrough();
  });

  it('should create', () => {
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
});

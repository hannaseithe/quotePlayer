import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AllQuotesComponent } from './all-quotes.component';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { CheckDeleteDialogComponent } from '../check-delete-dialog/check-delete-dialog.component';
import { DataService } from '../services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule, MatIconModule, MatDialogModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({ selector: 'app-quote-dialog', template: '' })
class QuoteDialogStubComponent {
}

describe('AllQuotesComponent', () => {
  let component: AllQuotesComponent;
  let fixture: ComponentFixture<AllQuotesComponent>;
  let dataService: DataService;
  let dialog;

  class MockDataService {
    allQuotes = new BehaviorSubject([]);
    deleteQuote = ()=> {}
  };
  class MockMatDialogService {
    open = () => {}
  };
  class MockMatDialogRef {
    afterClosed = () => new BehaviorSubject("result")
  }


  const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: 1 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [AllQuotesComponent, QuoteDialogStubComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialog, useClass: MockMatDialogService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = TestBed.get(DataService);
    dialog = TestBed.get(MatDialog);
    spyOn(dialog, "open").and.returnValue(new MockMatDialogRef());
    spyOn(dataService, "deleteQuote");
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should (not)contain Quote data after (un)publishing Quote', () => {
    const tableElement: HTMLElement = fixture.nativeElement;
    expect(tableElement.textContent).not.toContain('TEST QUOTE');

    dataService.allQuotes.next([testQuote1]);
    fixture.detectChanges();
    expect(tableElement.textContent).toContain('TEST QUOTE');
    expect(tableElement.textContent).toContain('TEST AUTHOR');
    expect(tableElement.textContent).toContain('TEST SOURCE');

    dataService.allQuotes.next([]);
    fixture.detectChanges();
    expect(tableElement.textContent).not.toContain('TEST QUOTE');
  });

  it('should attempt open edit Dialog', () => {
    let dialogElement = document.getElementsByClassName('.mat-dialog-container')[0];
    expect(dialogElement).not.toBeDefined();

    component.edit(testQuote1);
    fixture.detectChanges();
    expect(dialog.open).toHaveBeenCalledWith(QuoteDialogComponent, {
      width: '500px',
      data: { element: testQuote1 }
    });
  });

  it('should attempt to open check delete Dialog', () => {
    let dialogElement = document.getElementsByClassName('.mat-dialog-container')[0];
    expect(dialogElement).not.toBeDefined();

    component.delete(testQuote1);
    fixture.detectChanges();
    expect(dialog.open).toHaveBeenCalledWith(CheckDeleteDialogComponent, {
      width: '500px',
      data: { element: testQuote1 }
    });
    expect(dataService.deleteQuote).toHaveBeenCalledWith(testQuote1);
  });
});

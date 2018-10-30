import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QuoteComponent } from './quote.component';
import { MatDialogModule, MatSliderModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, MatTableModule, MatChipsModule, MatProgressSpinnerModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DataService } from '../services/data-module/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockDataService {
  saveOrUpdateQuote = () => Promise.resolve();
};

fdescribe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;
  let dataService;

  const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', tags: null, ID: '1' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule,
        MatIconModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReactiveFormsModule],
      declarations: [QuoteComponent],
      providers: [
        FormBuilder,
        { provide: DataService, useClass: MockDataService },
        MatSnackBar
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComponent);
    component = fixture.componentInstance;

    dataService = TestBed.get(DataService);

  });

  it('should create and set initial quote', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.quoteForm.getRawValue()).toEqual({ quote: '', author: '', source: '' });
  });

  it('should create and set provided quote', () => {
    component.quote = testQuote1;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.quoteForm.getRawValue()).toEqual({ quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE' });
  });

  it('should submitForm', fakeAsync(() => {
    component.quote = testQuote1;
    fixture.detectChanges();
    let result;
    component.close.subscribe((r: boolean) => result = r);
    component.submitForm();

    tick();
    fixture.detectChanges();

    expect(component.quoteForm.getRawValue()).toEqual({ quote: null, author: null, source: null });
    expect(result).toBe(true);
  }));

  

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComponent } from './quote.component';
import { MatDialogModule, MatSliderModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, MatTableModule } from '@angular/material';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockDataService {
  saveOrUpdateQuote = jasmine.createSpy();
};

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;
  let dataService;

  const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: 1 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
      declarations: [QuoteComponent],
      providers: [
        FormBuilder,
        { provide: DataService, useClass: MockDataService }
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

  it('should create and set provided quote', () => {
    component.quote = testQuote1;
    fixture.detectChanges();
    let result;
    component.close.subscribe((r: boolean) => result = r);
    component.onSubmit();
    expect(dataService.saveOrUpdateQuote).toHaveBeenCalledWith(testQuote1);
    expect(result).toBe(true);
  });

});

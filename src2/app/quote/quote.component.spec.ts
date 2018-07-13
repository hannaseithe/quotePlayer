import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComponent } from './quote.component';
import { MatDialogModule, MatSliderModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, MatTableModule } from '@angular/material';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockDataService { };

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, MatIconModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { QuoteDialogComponent } from './quote-dialog.component';


import { MatDialogModule, MatButtonModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

class MockMatDialogRef { };
class MockMAT_DIALOG_DATA { };

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
      declarations: [ QuoteDialogComponent, QuoteStubComponent ],
      imports: [  MatDialogModule, MatButtonModule ],
      providers: [
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

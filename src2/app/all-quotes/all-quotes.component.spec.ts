import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllQuotesComponent } from './all-quotes.component';
import { DataService } from '../services/data.service';
import { MatDialog } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule, MatIconModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


class MockDataService {
  allQuotes = new BehaviorSubject([])
};

class MockMatDialog { };

describe('AllQuotesComponent', () => {
  let component: AllQuotesComponent;
  let fixture: ComponentFixture<AllQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        MatTableModule,
        MatIconModule
      ],
      declarations: [AllQuotesComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialog, useClass: MockMatDialog }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

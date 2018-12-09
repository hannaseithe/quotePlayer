import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesInfoComponent } from './quotes-info.component';

describe('QuotesInfoComponent', () => {
  let component: QuotesInfoComponent;
  let fixture: ComponentFixture<QuotesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

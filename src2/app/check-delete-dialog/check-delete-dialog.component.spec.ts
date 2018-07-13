import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDeleteDialogComponent } from './check-delete-dialog.component';

import { MatDialogModule, MatButtonModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


class MockMatDialogRef { };
class MockMAT_DIALOG_DATA { };

describe('CheckDeleteDialogComponent', () => {
  let component: CheckDeleteDialogComponent;
  let fixture: ComponentFixture<CheckDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  MatDialogModule, MatButtonModule ],
      declarations: [ CheckDeleteDialogComponent ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useClass: MockMAT_DIALOG_DATA }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

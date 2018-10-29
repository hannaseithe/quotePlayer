import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistComponent } from './playlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatFormFieldModule, MatCardModule, MatSnackBar, MatSnackBarModule, MatInputModule } from '@angular/material';
import { DataService } from '../services/data-module/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: '1' };
const testPlaylist1 = { ID: 'TESTID', name: 'TEST PLAYLIST', quotes: [], quoteDocs: [testQuote1] };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };


fdescribe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatSnackBarModule,
        MatInputModule,
        MatProgressSpinnerModule
      ],
      declarations: [ PlaylistComponent ],
      providers: [DataService,
      MatSnackBar]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should onSubmit()', () => {
    

    component.playlist = testPlaylist1;
    component.ngOnChanges({playlist: testPlaylist1});
    fixture.detectChanges();
    let componentEl = fixture.debugElement.query(By.css('input'));
    expect(componentEl.nativeElement.value).toEqual(testPlaylist1.name);

    component.onSubmit();
    fixture.detectChanges();
    
    expect(componentEl.nativeElement.value).not.toEqual(testPlaylist1.name); 
  })
});

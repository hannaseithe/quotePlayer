import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPlaylistsComponent } from './all-playlists.component';
import { PlaylistComponent } from '../playlist/playlist.component';
import { MatTableModule, MatIconModule, MatProgressSpinnerModule, MatToolbarModule, MatCardModule, MatTooltipModule, MatChipsModule, MatFormFieldModule, MatDialog, MatDialogModule, MatSnackBarModule, MatSnackBar, MatInputModule } from '../../../node_modules/@angular/material';
import { DragulaModule, DragulaService } from '../../../node_modules/ng2-dragula';
import { ReactiveFormsModule, FormsModule } from '../../../node_modules/@angular/forms';
import { DataService } from '../services/data-module/data.service';
import { BehaviorSubject } from '../../../node_modules/rxjs';
import { BrowserAnimationsModule } from '../../../node_modules/@angular/platform-browser/animations';
import { Playlist } from '../data-model/playlist.model';
import { Quote } from '../data-model/quote.model';


const testQuote1:Quote = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: '1' };
const testPlaylist1: Playlist = { ID: 'TESTID', name: 'TEST PLAYLIST', quotes: [testQuote1.ID], quoteDocs: [testQuote1] };
const mockDataUrl = 'MOCKDATAURL';
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };

class MockDataService {
  allQuotes = new BehaviorSubject([testQuote1]);
  allPlaylists = new BehaviorSubject([testPlaylist1]);
}

fdescribe('AllPlaylistsComponent', () => {
  let component: AllPlaylistsComponent;
  let fixture: ComponentFixture<AllPlaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatCardModule,
        MatTooltipModule,
        MatChipsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSnackBarModule,
        MatInputModule,
        DragulaModule.forRoot()],
      declarations: [AllPlaylistsComponent,
        PlaylistComponent],
        providers:[
          {provide: DataService, useClass: MockDataService}, MatDialog, DragulaService, MatSnackBar]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.dataSource).toEqual([testPlaylist1]);
    expect(component.allQuotes).toEqual([testQuote1]);
  });
});

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

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
import { By } from '../../../node_modules/@angular/platform-browser';


const testQuote1: Quote = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: '1' };
const testPlaylist1: Playlist = { ID: 'TESTID', name: 'TEST PLAYLIST', quotes: [], quoteDocs: [testQuote1] };
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: '2' };

class MockDataService {
  allQuotes = new BehaviorSubject([testQuote1]);
  allPlaylists = new BehaviorSubject([testPlaylist1]);
  saveOrUpdatePlaylist = () => Promise.resolve();
  deletePlaylist = () => {
    return Promise.resolve()
      .then(() => this.allPlaylists.next([]))};
  deleteQuoteFromPlaylist = () => Promise.resolve();
}

class MockDragulaService {
  destroy = jasmine.createSpy();
  createGroup = jasmine.createSpy();
  dropModel = () => { return { subscribe: () => { } } };
  find = jasmine.createSpy();
}

class MockDialog {
  open = () => {
    return {
      afterClosed: () => new BehaviorSubject([testQuote2])
    }
  }
}

fdescribe('AllPlaylistsComponent', () => {
  let component: AllPlaylistsComponent;
  let fixture: ComponentFixture<AllPlaylistsComponent>;
  let dragulaService;
  let matRowEl, matHeaderRowEl;

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
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialog, useClass: MockDialog },
        DragulaService,
        /* { provide: DragulaService, useClass: MockDragulaService }, */
        MatSnackBar]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dragulaService = TestBed.get(DragulaService);
    spyOn(dragulaService, 'createGroup').and.callThrough();

    fixture = TestBed.createComponent(AllPlaylistsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    matHeaderRowEl = fixture.debugElement.query(By.css('.item1 .mat-header-row'));
    matRowEl = fixture.debugElement.query(By.css('.item1 .mat-row'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.dataSource).toEqual([testPlaylist1]);
    expect(component.allQuotes).toEqual([testQuote1]);
    expect(component.selectedPlaylist).toBeUndefined();

    expect(dragulaService.createGroup).toHaveBeenCalled();
    const object = dragulaService.createGroup.calls.argsFor(0)[1];
    expect(object.moves).toBeTruthy();
    expect(object.moves({ classList: 'mat-header-row' })).toBe(false);
    expect(object.moves({ classList: '' })).toBe(true);

    expect(matRowEl.nativeElement.textContent).toContain(testPlaylist1.name);

  });

  it('should displayFn', () => {
    expect(component.displayFn({ quote: 'abcdefghijklmnopqrstuvwxyz' })).toBe('abcdefghijklmnopqrstuvwxy...');
    expect(component.displayFn({ quote: 'abcdefghijklmnopqrstuvwxy' })).toBe('abcdefghijklmnopqrstuvwxy');
  })


  it('should onSubmit', fakeAsync(() => {
    component.selectedPlaylist = testPlaylist1;
    component.onSubmit();
    fixture.detectChanges();
    expect(component.addQuotesInProgress).toBe(true);

    let spinner2El = fixture.debugElement.query(By.css('.custom-spinner-2'));
    expect(spinner2El).toBeTruthy();

    tick();
    fixture.detectChanges();
    spinner2El = fixture.debugElement.query(By.css('.custom-spinner-2'));
    expect(component.addQuotesInProgress).toBe(false);
    expect(spinner2El).toBeFalsy();

    expect(component.selectedPlaylist.quotes).toEqual(['1'])
  }));

  it('should show selected Playlist', () => {
    let selectedPlaylistEl = fixture.debugElement.query(By.css('.item2 .selected-playlist-container'));
    let toolbarEl = fixture.debugElement.query(By.css('.item2 .mat-toolbar'));
    expect(selectedPlaylistEl).toBeFalsy();
    expect(toolbarEl).toBeTruthy();

    component.selectedPlaylist = testPlaylist1;
    fixture.detectChanges();

    selectedPlaylistEl = fixture.debugElement.query(By.css('.item2 .selected-playlist-container'));
    toolbarEl = fixture.debugElement.query(By.css('.item2 .mat-toolbar'));
    expect(selectedPlaylistEl).toBeTruthy();
    expect(toolbarEl).toBeFalsy();
  });

  it('should addQuoteDialog', fakeAsync(() => {

    component.selectedPlaylist = testPlaylist1;
    component.addQuoteDialog();
    tick();
    fixture.detectChanges();
    expect(component.selectedPlaylist).toEqual({ ID: 'TESTID', name: 'TEST PLAYLIST', quotes: ['1', '2'], quoteDocs: [testQuote1, testQuote2] })
    let selectedPlaylistEl = fixture.debugElement.query(By.css('.item2 .selected-playlist-container'));
    expect(selectedPlaylistEl.nativeElement.textContent).toContain(testQuote1.quote);
    expect(selectedPlaylistEl.nativeElement.textContent).toContain(testQuote1.author);
    expect(selectedPlaylistEl.nativeElement.textContent).toContain(testQuote1.source);
    expect(selectedPlaylistEl.nativeElement.textContent).toContain(testQuote2.quote);
    expect(selectedPlaylistEl.nativeElement.textContent).toContain(testQuote2.author);
    expect(selectedPlaylistEl.nativeElement.textContent).toContain(testQuote2.source);
  }));

  it('should delete', fakeAsync(() => {
    component.delete(component.dataSource[0]);
    fixture.detectChanges();

    expect(component.dataSource[0].deletePLInProgress).toBe(true);
    let spinner1El = fixture.debugElement.query(By.css('.custom-spinner-1'));
    expect(spinner1El).toBeTruthy();

    tick();
    fixture.detectChanges();
    spinner1El = fixture.debugElement.query(By.css('.custom-spinner-1'));
    expect(spinner1El).toBeFalsy();

    let playlistTableEl = fixture.debugElement.query(By.css('.item1 .mat-table'));
    expect(playlistTableEl.nativeElement.textContent).not.toContain(testPlaylist1.name);

  }));

  it('should deleteQuote', fakeAsync(() => {
    component.selectedPlaylist = testPlaylist1;
    component.deleteQuote(component.selectedPlaylist.quoteDocs[0], 0);
    fixture.detectChanges();

    expect(component.selectedPlaylist.quoteDocs[0].deleteInProgress).toBe(true);
    let spinner3El = fixture.debugElement.query(By.css('.custom-spinner-3'));
    expect(spinner3El).toBeTruthy();

    tick();
    fixture.detectChanges();
    expect(component.selectedPlaylist.quoteDocs[0].deleteInProgress).toBe(false);
    spinner3El = fixture.debugElement.query(By.css('.custom-spinner-3'));
    expect(spinner3El).toBeFalsy();
  }))
});

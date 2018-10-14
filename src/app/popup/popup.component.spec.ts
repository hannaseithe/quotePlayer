import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent, DisableControlDirective } from './popup.component';
import { Component, DebugElement } from '../../../node_modules/@angular/core';
import { By } from '../../../node_modules/@angular/platform-browser';
import { NgControl, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatAutocompleteModule, MatIconModule, MatCardModule, MatInputModule } from '../../../node_modules/@angular/material';
import { BrowserAnimationsModule } from '../../../node_modules/@angular/platform-browser/animations';

const chrome = require('sinon-chrome');

const testQuote1 = { quote: 'TEST QUOTE', author: 'TEST AUTHOR', source: 'TEST SOURCE', ID: 1 };
const testPlaylist1 = { ID: 'TESTID', name: 'TEST PLAYLIST', quotes: [testQuote1.ID], quoteDocs: [testQuote1] };
const mockDataUrl = 'MOCKDATAURL';
const testQuote2 = { quote: 'TEST QUOTE2', author: 'TEST AUTHOR2', source: 'TEST SOURCE2', ID: 2 };

@Component({
  template: `<input type="text" [formControl]="myControl" [disableControl]="isDisabled">`
})
class TestDisableControlComponent {
  isDisabled = false;
  myControl = new FormControl()
}


describe('Directive: DisableControl', () => {

  let component: TestDisableControlComponent;
  let fixture: ComponentFixture<TestDisableControlComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestDisableControlComponent, DisableControlDirective],
      providers: [NgControl]
    });
    fixture = TestBed.createComponent(TestDisableControlComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should disable input', () => {
    expect(inputEl.nativeElement.disabled).toBe(false);
    component.isDisabled = true;
    fixture.detectChanges();
    expect(inputEl.nativeElement.disabled).toBe(true);
  });

});

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let timeEl, playlistsEl, playButtonEl, stopButtonEl, editEl: DebugElement;

  beforeEach(() => {
    (global as any).chrome = chrome;
    (global as any).chrome.runtime = {
      onMessage: {
        addListener: jasmine.createSpy()
      },
      sendMessage: jasmine.createSpy()
    };
    (global as any).chrome.browserAction = {
      setIcon: jasmine.createSpy()
    };
    (global as any).chrome.tabs = {
      query: jasmine.createSpy(),
      update: jasmine.createSpy(),
      create: jasmine.createSpy()
    }

  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule, ReactiveFormsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatIconModule,
        MatCardModule,
        MatInputModule],
      declarations: [PopupComponent, DisableControlDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    timeEl = fixture.debugElement.query(By.css('.time-field'));
    playlistsEl = fixture.debugElement.query(By.css('.playlists-field'));
    playButtonEl = fixture.debugElement.query(By.css('.play-button'));
    stopButtonEl = fixture.debugElement.query(By.css('.stop-button'));
    editEl = fixture.debugElement.query(By.css('.edit-button'));

  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.state).toEqual({
      running: false,
      time: null,
      playlist: null,
      playlists: [],
      count: 0
    })
    expect(component.playlistForm).toBeTruthy();
    expect(component.playlistForm.controls['playlist']).toBeTruthy();
    expect(component.playlistForm.controls['speed']).toBeTruthy();
    expect((global as any).chrome.runtime.onMessage.addListener).toHaveBeenCalled();

    expect(timeEl.nativeElement.disabled).toBe(false);
    expect(playlistsEl.nativeElement.disabled).toBe(false);
    expect(playButtonEl.nativeElement.disabled).toBe(false);
    expect(stopButtonEl.nativeElement.disabled).toBe(true);
    expect(editEl.nativeElement.disabled).toBe(false);
  });

  it('should getState', async(() => {
    component.getState();
    expect((global as any).chrome.runtime.sendMessage).toHaveBeenCalled();
    expect((global as any).chrome.runtime.sendMessage.calls.argsFor(1)[0]).toEqual({ msg: "getState" });
    const callBack = (global as any).chrome.runtime.sendMessage.calls.argsFor(1)[1];
    callBack({ running: true, playlist: testPlaylist1, playlists: [testPlaylist1], time: 60000, count: 3 });
    expect(component.state).toEqual({ running: true, playlist: testPlaylist1, playlists: [testPlaylist1], time: '00:01:00', count: 3 })

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(timeEl.nativeElement.disabled).toBe(true);
      expect(playlistsEl.nativeElement.disabled).toBe(true);
      expect(playButtonEl.nativeElement.disabled).toBe(true);
      expect(stopButtonEl.nativeElement.disabled).toBe(false);

      expect(timeEl.nativeElement.value).toBe('00:01:00');
      expect(playlistsEl.nativeElement.value).toBe(testPlaylist1.name);
    })


  }));

  it('should startTimer', () => {
    expect((global as any).chrome.runtime.sendMessage.calls.count()).toBe(1);
    component.playlistForm.patchValue({
      playlist: testPlaylist1,
      speed: '00:01:00'
    })
    component.startTimer();
    expect((global as any).chrome.runtime.sendMessage.calls.count()).toBe(2);
    expect((global as any).chrome.runtime.sendMessage.calls.argsFor(1)[0]).toEqual({
      msg: "startTimer",
      time: 60000,
      playlist: testPlaylist1
    });
    const callBack = (global as any).chrome.runtime.sendMessage.calls.argsFor(1)[1];
    callBack({ running: true });
    expect(component.state.running).toBe(true);
    expect(chrome.browserAction.setIcon).toHaveBeenCalledWith({ path: 'iconk-run.png' });
  });

  it('should stopTimer', () => {
    component.stopTimer();
    expect((global as any).chrome.runtime.sendMessage.calls.count()).toBe(2);
    expect((global as any).chrome.runtime.sendMessage.calls.argsFor(1)[0]).toEqual({
      msg: "stopTimer"
    });
    const callBack = (global as any).chrome.runtime.sendMessage.calls.argsFor(1)[1];
    callBack({ running: false });
    expect(component.state.running).toBe(false);
    expect(chrome.browserAction.setIcon).toHaveBeenCalledWith({ path: 'iconk.png' });
  });

  it('should displayFn', () => {
    expect(component.displayFn({ name: 'TEST NAME' })).toBe('TEST NAME');
  })

  it('should openEditPage', () => {
    component.openEditPage();
    expect(chrome.tabs.query).toHaveBeenCalled();
    expect((global as any).chrome.tabs.query.calls.argsFor(0)[0]).toEqual({ url: 'chrome-extension://*/app2/index.html*' });
    const callBack = (global as any).chrome.tabs.query.calls.argsFor(0)[1];
    callBack([{id: 1}]);
    expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true });
    callBack([]);
    expect(chrome.tabs.create).toHaveBeenCalled();
  })

});

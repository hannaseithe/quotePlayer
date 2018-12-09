import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPlaylistInfoComponent } from './selected-playlist-info.component';

describe('SelectedPlaylistInfoComponent', () => {
  let component: SelectedPlaylistInfoComponent;
  let fixture: ComponentFixture<SelectedPlaylistInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedPlaylistInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedPlaylistInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

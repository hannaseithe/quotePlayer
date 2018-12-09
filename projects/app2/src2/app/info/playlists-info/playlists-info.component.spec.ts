import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsInfoComponent } from './playlists-info.component';

describe('PlaylistsInfoComponent', () => {
  let component: PlaylistsInfoComponent;
  let fixture: ComponentFixture<PlaylistsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data-module/data.service';
import { Playlist } from '../data-model/playlist.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  @Input() playlist?: Playlist;

  playlistForm: FormGroup;
  constructor(private formbuilder: FormBuilder,
  private data: DataService,
  private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.playlist) {
    } else {
      this.playlist = {
        ID : null,
        name: '',
        quotes: []
      }
    }

    this.playlistForm = this.formbuilder.group({
      name: this.playlist.name
    });
    
  }

  ngOnChanges(changes) {
    if(this.playlist) {
      this.playlistForm = this.formbuilder.group({
        name: this.playlist.name
      });
      this.cd.detectChanges();
    }
    
  }

  onSubmit() {
    this.data.saveOrUpdatePlaylist(this.prepareSubmitPlaylist());

    this.playlistForm.reset();
    this.playlist = {
      ID : null,
      name: '',
      quotes: []
    };
  }

  prepareSubmitPlaylist() {
    const formModel = this.playlistForm.value;
    return {
      ID: this.playlist.ID,
      name: formModel.name as string,
      quotes: this.playlist.quotes,
    }
  };

}

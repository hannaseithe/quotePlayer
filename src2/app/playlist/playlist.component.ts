import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
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
  private data: DataService) {
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

  onSubmit() {
    this.playlist = this.prepareSubmitPlaylist();
    this.data.saveOrUpdatePlaylist(this.playlist);
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

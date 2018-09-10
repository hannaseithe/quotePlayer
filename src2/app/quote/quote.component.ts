import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';
import { MatChipInputEvent } from '../../../node_modules/@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

  @Input() quote?: Quote;
  @Output() close = new EventEmitter<boolean>();

  quoteForm: FormGroup;
  constructor(private formbuilder: FormBuilder,
    private data: DataService,
    private cd: ChangeDetectorRef) {
  }

  //chips
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  tags = [];

  ngOnInit() {
    if (this.quote) {
      this.tags = this.quote.tags.slice(0);
    } else {
      this.quote = {
        ID: null,
        quote: '',
        author: '',
        source: '',
        tags: [],
        playlists: []
      };
    }

    this.quoteForm = this.formbuilder.group({
      quote: [this.quote.quote, Validators.required],
      author: this.quote.author,
      source: this.quote.source
    });

  }

  ngOnChanges(changes) {
    if (this.quote) {
      this.quoteForm = this.formbuilder.group({
        quote: [this.quote.quote, Validators.required],
        author: this.quote.author,
        source: this.quote.source
      });
      this.tags = this.quote.tags.slice(0);
      this.cd.detectChanges();
    }

  }

 submitForm() {

    this.data.saveOrUpdateQuote(this.prepareSubmitQuote());
    this.quoteForm.reset();
    this.quote = {
      ID: null,
      quote: '',
      author: '',
      source: '',
      tags: [],
      playlists: []
    };
    this.tags = [];
    this.close.emit(true);
    this.quoteForm.markAsUntouched();
    this.quoteForm.markAsPristine();
  }

  prepareSubmitQuote() {
    const formModel = this.quoteForm.value;
    return {
      ID: this.quote.ID,
      quote: formModel.quote as string,
      author: formModel.author as string,
      source: formModel.source as string,
      tags: this.tags,
      playlists: this.quote.playlists
    }
  };

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.quoteForm.markAsTouched();
  }

  removeTag(index): void {
  
     if (index >= 0) {
         this.tags.splice(index,1);
     }
     this.quoteForm.markAsTouched();
  }

  extraReset() {
    this.tags = [];
  }
}

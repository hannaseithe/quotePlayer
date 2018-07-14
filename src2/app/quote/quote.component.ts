import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';

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
  private data: DataService) {
  }

  ngOnInit() {
    if (this.quote) {
    } else {
      this.quote = {
        ID: null,
        quote: '',
        author: '',
        source: ''
      };
    }

    this.quoteForm = this.formbuilder.group({
      quote: [this.quote.quote, Validators.required],
      author: this.quote.author,
      source: this.quote.source
    });
    
  }

  onSubmit() {
    this.quote = this.prepareSubmitQuote();
    this.data.saveOrUpdateQuote(this.quote);
    this.close.emit(true);
  }

  prepareSubmitQuote() {
    const formModel = this.quoteForm.value;
    return {
      ID: this.quote.ID,
      quote: formModel.quote as string,
      author: formModel.author as string,
      source: formModel.source as string
    }
  };
}

import { Component, OnInit, Input } from '@angular/core';
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

  quoteForm: FormGroup = new FormGroup({
    quote: new FormControl(),
    author: new FormControl(),
    source: new FormControl()
  });

  constructor(private formbuilder: FormBuilder,
  private data: DataService) {
  }

  ngOnInit() {
    if (this.quote) {
    } else {
      this.quote = {
        id: null,
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
    this.data.saveQuote(this.quote);
  }

  prepareSubmitQuote() {
    const formModel = this.quoteForm.value;
    return {
      id: this.quote.id,
      quote: formModel.quote as string,
      author: formModel.author as string,
      source: formModel.soruce as string
    }
  };
}

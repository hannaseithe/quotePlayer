import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Quote } from '../data-model/quote.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

  quoteForm: FormGroup = new FormGroup({
    text: new FormControl(),
    author: new FormControl(),
    source: new FormControl()
  });

  quote: Quote = {
    id: null,
    text: '',
    author: '',
    source: ''
  };

  constructor(private formbuilder: FormBuilder,
  private data: DataService) {
    this.quoteForm = this.formbuilder.group({
      text: ['', Validators.required],
      author: '',
      source: ''
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.quote = this.prepareSubmitQuote();
    this.data.saveQuote(this.quote);
  }

  prepareSubmitQuote() {
    const formModel = this.quoteForm.value;
    return {
      id: this.quote.id,
      text: formModel.text as string,
      author: formModel.author as string,
      source: formModel.soruce as string
    }
  };
}

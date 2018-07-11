/// <reference types="chrome/chrome-app"/>

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Quote } from '../data-model/quote.model';

declare global {
    interface Window { saveQuote: any; }
}

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {


    public state = {
        running: false,
        minutes: 1
    }

    private saveQuote: any;
    

    quoteForm: FormGroup = new FormGroup ({
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

    update(value) {
        this.state.minutes = value;
    }  

    getState() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "getState" }, function (response) {
            that.state.running = response.running;
            that.state.minutes = response.minutes;
            console.log(that.state);
            that.ref.detectChanges();
        });
    }
    
    startTimer() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "startTimer", minutes: this.state.minutes }, function (response) {
            that.state.running = response.running;
            that.ref.detectChanges();
        });
    }

    stopTimer() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "stopTimer"}, function (response) {
            that.state.running = response.running;
            that.ref.detectChanges();
        });
    }

    constructor(private ref: ChangeDetectorRef, private formbuilder: FormBuilder) {
        var that = this;
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                switch (request.msg) {
                    case "updateState":
                        that.state = request.data;
                        break;
                    default:
                        console.log("Unidentified Message received");
                }
            }
        );

        this.quoteForm = this.formbuilder.group({
            text: ['', Validators.required ],
            author: '',
            source: ''
          });

    }

    ngOnInit() {
        this.getState();
        this.saveQuote = chrome.extension.getBackgroundPage().saveQuote;
    }

    onSubmit() {
        this.quote = this.prepareSubmitQuote();
        this.saveQuote(this.quote);
      }

    prepareSubmitQuote() {
        const formModel = this.quoteForm.value;
        return {
            id: this.quote.id,
            text: formModel.text as string,
            author: formModel.author as string,
            source: formModel.soruce as string
        }
    } ;
    
}

/// <reference types="chrome/chrome-app"/>

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
                        ref.detectChanges();
                        break;
                    default:
                        console.log("Unidentified Message received");
                }
            }
        );

    }

    ngOnInit() {
        this.getState();
    }

    openBackground() {
        chrome.tabs.create({url: chrome.extension.getURL('app2/index.html')});
    }
    
}

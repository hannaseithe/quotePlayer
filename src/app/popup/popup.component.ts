/// <reference types="chrome/chrome-app"/>

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

    public running = false;
    public minutes = 1;

    public getState() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "getState" }, function (response) {
            that.running = response.running;
            that.ref.detectChanges();
        });
    }
    
    public startTimer() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "startTimer", minutes: this.minutes }, function (response) {
            that.running = response.running;
            that.ref.detectChanges();
        });
    }

    public stopTimer() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "stopTimer"}, function (response) {
            that.running = response.running;
            that.ref.detectChanges();
        });
    }

    constructor(private ref: ChangeDetectorRef) {

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                switch (request.msg) {
                    case "togglePlayStop":
                        this.state.running = !this.state.running
                        break;
                    default:
                        console.log("Unidentified Message received");
                }
            }
        );


        /*  var config = chrome.extension.getBackgroundPage().getState(); */


    }

    ngOnInit() {
        this.getState();
    }
    /* 
           this.intervalSlider = document.getElementById('intervalLength');
           this.submitButton = document.getElementById('submit');
   
   
   
           this.stopButton.onclick = function () {
               stopFn();
               togglePlayStop();
           };
   
           this.submitButton.onclick = function () {
               saveQuote(document.forms[0]);
           } */

    /*     
    
        setState(response) {
            togglePlayStop(response.running);
        }
    
    
        toggleButtonDisabled = function (element) {
            element.disabled = !element.disabled;
        }
    
        togglePlayStop = function () {
            toggleButtonDisabled(playButton);
            toggleButtonDisabled(stopButton);
        }
    
        setRunning(running) {
    
        } */

    /*     private playButton: Element;
        private stopButton: Element;
        private intervalSlider: Element;
        private submitButton: Element; */



}

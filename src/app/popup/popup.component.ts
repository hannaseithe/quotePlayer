/// <reference types="chrome/chrome-app"/>

import { Component, OnInit, ChangeDetectorRef, Directive, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare global {
    interface Window { saveQuote: any; }
}

import { NgControl } from '@angular/forms';

@Directive({
    selector: '[disableControl]'
})
export class DisableControlDirective {

    @Input() set disableControl(condition: boolean) {
        const action = condition ? 'disable' : 'enable';
        this.ngControl.control[action]();
    }

    constructor(private ngControl: NgControl) {
    }

}

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

    public state = {
        running: false,
        time: null,
        playlist: null,
        playlists: [],
        count: 0
    }
    playlists;

    playlistForm = this.formbuilder.group({
        playlist: null,
        speed: null
    });



    getState() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "getState" }, function (response) {

            that.state.running = response.running;
            that.state.playlist = response.playlist;
            that.state.playlists = response.playlists;
            const timeDate = new Date(response.time);
            that.state.time = timeDate.toUTCString().match(/((\d{2}:){2}\d{2})/g)[0];

            if (!that.playlistForm.value.playlist) {
                that.playlistForm.patchValue({
                    playlist: that.state.playlist ? that.state.playlist : that.state.playlists[0],
                    speed: that.state.time
                })
            }

            that.ref.detectChanges();
        });
    }

    startTimer() {
        let that = this;
        const timeArray = this.playlistForm.value.speed.match(/(\d{2}):(\d{2}):(\d{2})/);
        chrome.runtime.sendMessage({
            msg: "startTimer",
            time: Number(timeArray[1]) * 3600000 + Number(timeArray[2]) * 60000 + Number(timeArray[3]) * 1000,
            playlist: this.playlistForm.value.playlist
        }, function (response) {
            that.state.running = response.running;
            that.ref.detectChanges();
        });
    }

    stopTimer() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "stopTimer" }, function (response) {
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

    displayFn = (q) => q ? q.name : undefined;

    openBackground() {
        chrome.tabs.create({ url: chrome.extension.getURL('app2/index.html') });
    }

}

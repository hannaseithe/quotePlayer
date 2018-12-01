/// <reference types="chrome/chrome-app"/>

import { Component, OnInit, ChangeDetectorRef, Directive, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

    state = {
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

    constructor(private ref: ChangeDetectorRef, private formbuilder: FormBuilder) {
        var that = this;
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                switch (request.msg) {
                    case "updateState":
                        that.state = request.data;
                        chrome.browserAction.setIcon({ path: that.state.running ? "iconk-run.png" : "iconk.png" });
                        ref.detectChanges();
                        break;
                    default:
                        console.error("Unidentified Message received");
                }
            }
        );

    }

    getState() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "getState" }, function (response) {

            that.state.running = response.running;
            that.state.playlist = response.playlist;
            that.state.playlists = response.playlists;
            that.state.count = response.count;
            const timeDate = new Date(response.time);
            that.state.time = timeDate.toUTCString().match(/((\d{2}:){2}\d{2})/g)[0];

            that.playlistForm.patchValue({
                playlist: that.state.playlist ? that.state.playlist : that.state.playlists[0],
                speed: that.state.time
            })

            /* that.ref.detectChanges(); */
        });
    }

    startTimer() {
        let that = this;
        const timeArray = this.playlistForm.value.speed.match(/(\d{2}):(\d{2}):?(\d{2})?/);
        chrome.runtime.sendMessage({
            msg: "startTimer",
            time: Number(timeArray[1]) * 3600000 + Number(timeArray[2]) * 60000 + Number(timeArray[3] ? timeArray[3] : 0) * 1000,
            playlist: this.playlistForm.value.playlist
        }, function (response) {
            if (response) {
                that.state.running = response.running;
                chrome.browserAction.setIcon({ path: "iconk-run.png" });
                that.ref.detectChanges();
            }

        });
    }

    stopTimer() {
        let that = this;
        chrome.runtime.sendMessage({ msg: "stopTimer" }, function (response) {
            that.state.running = response.running;
            chrome.browserAction.setIcon({ path: "iconk.png" });
            that.ref.detectChanges();
        });
    }


    ngOnInit() {
        this.getState();
    }

    displayFn = (q) => q ? q.name : undefined;

    openEditPage() {
        chrome.tabs.query({ url: 'chrome-extension://*/app2/index.html*' }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { active: true })
            } else {
                chrome.tabs.create({ url: chrome.extension.getURL('app2/index.html') });
            }
        });

    }

}

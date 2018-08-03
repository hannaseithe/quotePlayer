import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../data-model/quote.model';

@Injectable()
export class PlayerService {

  private timeoutId;
  private notificationId = 0;
  private quotes: Array<Quote> = [];

  private state = {
    count: 0,
    running: false,
    minutes: 1,
    playlists: []
  }


  constructor(private data: DataService) {
    let that = this;
    console.log('constructor Player');

    chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
      if (id === "quote" + that.notificationId) {
        if (buttonIndex === 0) {
          chrome.notifications.clear(id);
        } else if (buttonIndex === 1) {
          that.stopInterval();
        }
      }
    });

    chrome.notifications.onClosed.addListener(function (id) {
      if (id === "quote" + that.notificationId) {
        that.startTimer(that.state.minutes);
      }
    });


    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        switch (request.msg) {
          case "getState":
            sendResponse(that.state);
            break;
          case "startTimer":
            if (that.startInterval(request.minutes, request.playlist)) {
              sendResponse(that.state)
            };
            break;
          case "stopTimer":
            that.stopInterval();
            sendResponse(that.state);
            break;
          default:
            console.log("background.js: Unidentified Message received ");
        }
      });


  }

  init() {
    this.data.allPlaylists.subscribe(x => this.state.playlists = x);
    /* this.data.currentQuotes.subscribe(x => this.quotes = x) */
  }

  stopInterval = function () {
    try { chrome.notifications.clear("quote" + this.notificationId) }
    catch (error) { console.log('Could not clear notification: ' + error) }
    this.notificationId++;
    clearTimeout(this.timeoutId);
    this.state.running = false;
  }

  startInterval = function (duration, playlist) {
    this.state.running = true;
    this.state.minutes = duration || 1;
    this.state.playlist = playlist;
    this.quotes = playlist.quoteDocs;
    return this.startTimer(this.state.minutes);
  }

  private startTimer(minutes) {
    if (this.quotes.length === 0) {
      chrome.notifications.create("emptyPlaylist", {
        type: "basic",
        title: "Your selected Playlist is empty",
        message: "Please select a different playlist that contains quotes",
        iconUrl: "../icong.png"
      });
      return false;
    } else {
      this.timeoutId = setTimeout(() => {
      var options = {
        type: "basic",
        title: "A quote by " + this.quotes[this.state.count % this.quotes.length].author,
        message: this.quotes[this.state.count % this.quotes.length].quote,
        contextMessage: "Source: " + this.quotes[this.state.count % this.quotes.length].source,
        buttons: [
          { title: "close" },
          { title: "stop" }
        ],
        requireInteraction: true,
        iconUrl: "../icong.png"
      };
      try { chrome.notifications.create("quote" + this.notificationId, options) }
      catch (error) { console.log('Could not create notification: ' + error) }
      this.state.count++;

    }, minutes * 60000);
    return true
    }
    
  }
}

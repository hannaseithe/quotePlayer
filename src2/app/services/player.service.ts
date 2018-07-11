import { Injectable } from '@angular/core';
import { ChromeMessageService } from './chrome-message.service';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../data-model/quote.model';

@Injectable()
export class PlayerService {

  private timeoutId;
  private notificationId = 0;
  private quotes: Array<Quote> = [];

  state = {
    count: 0,
    running: false,
    minutes: null
  }


  constructor(private chromeMessage: ChromeMessageService,
    private data: DataService) {
    chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
      if (id === "quote" + this.notificationId) {
        if (buttonIndex === 0) {
          chrome.notifications.clear(id);
        } else if (buttonIndex === 1) {
          this.stopInterval();
          chrome.runtime.sendMessage({
            msg: "togglePlayStop"
          });
        }
      }
    });

    chrome.notifications.onClosed.addListener(function (id) {
      if (id === "quote" + this.notificationId) {
        this.startTimer(this.state.minutes);
      }
    });

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          switch (request.msg) {
              case "getState":
                  sendResponse(this.state);
                  break;
              case "startTimer":
                  this.startInterval(request.minutes);
                  sendResponse(this.state);
                  break;
              case "stopTimer":
                  this.stopInterval();
                  sendResponse(this.state);
                  break;
              default:
                  console.log("background.js: Unidentified Message received ");
          }
      });

    this.data.currentQuotes.subscribe(x => this.quotes = x)
  }

  stopInterval = function () {
    chrome.notifications.clear("quote" + this.notificationId);
    this.notificationId++;
    window.clearTimeout(this.timeoutId);
    this.updateState({ running: false });
  }

  startInterval = function (duration) {
    this.state.running = true;
    this.state.minutes = duration || 1;
    this.startTimer(this.state.minutes);

  }

  updateState(newState) {
    Object.assign(this.state, newState);
    this.chromeMessage.sendMessage("updateState", this.state);
  }

  private startTimer(minutes) {
    this.timeoutId = window.setTimeout(function () {
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
        iconUrl: "icon.png"
      };
      chrome.notifications.create("quote" + this.notificationId, options);
      this.state.count++;

    }, minutes * 6000);
  }

}

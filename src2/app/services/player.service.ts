import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../data-model/quote.model';

@Injectable()
export class PlayerService {

  private timeoutId;
  private notificationId = 0;
  private quotes: Array<Quote> = [];
  private canvas;
  private text;
  private radius = 0;

  private state = {
    count: 0,
    running: false,
    minutes: 1,
    playlists: []
  }


  constructor(private data: DataService) {
    let that = this;

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

  private wrapText(context, text, x, y, maxWidth) {
    var words = text.split(' ');
    var line = '';
    let point, lineHeight;

    point = Math.ceil(300/(words.length + 4))+ 12;
    context.font = point +"pt Calibri";
    lineHeight = point + 10;
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        y += lineHeight;
        context.fillText(line, x, y);
        line = words[n] + ' ';
        
      }
      else {
        line = testLine;
      }
    }
    y += lineHeight;
    context.fillText(line, x, y);
  }

 


  private startTimer(minutes) {
    let canvas, radius, text;

    window.requestAnimationFrame =
    window.requestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame;

    let animate = () => {
      console.log("animate()");
      var context = canvas.getContext("2d");
      var maxWidth = 440;
      var x = (canvas.width - maxWidth) / 2;
      var y = 15;
  
      this.wrapText(context,text,x,y,maxWidth); 
    }

    if (!this.quotes) {
      chrome.notifications.create("emptyPlaylist", {
        type: "basic",
        title: "No Playlist selected",
        message: "Please select a playlist to play",
        iconUrl: "../icong.png"
      });
      return false;
    } else if (this.quotes.length === 0) {
      chrome.notifications.create("emptyPlaylist", {
        type: "basic",
        title: "Your selected Playlist is empty",
        message: "Please select a different playlist that contains quotes",
        iconUrl: "../icong.png"
      });
      return false;
    } else {
      this.timeoutId = setTimeout(() => {
        console.log((navigator as any).oscpu);
        canvas = document.createElement('canvas');
        text = this.quotes[this.state.count % this.quotes.length].quote;
        radius = 0;

        canvas.id = "CursorLayer";
        canvas.width = 500;
        canvas.height = 350;

        animate()

        var options = {
          type: "image",
          title: "A quote by " + this.quotes[this.state.count % this.quotes.length].author,
          message: this.quotes[this.state.count % this.quotes.length].quote,
          contextMessage: "Source: " + this.quotes[this.state.count % this.quotes.length].source,
          imageUrl: canvas.toDataURL('image/png'),
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

      }, minutes * 6000);
      return true
    }

  }
}

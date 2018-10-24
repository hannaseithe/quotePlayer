import { Injectable } from '@angular/core';
import { DataService } from '../../../../../src2/app/services/data-module/data.service';
import { Quote } from '../../../../../src2/app/data-model/quote.model';
import { PouchDbService } from '../../../../../src2/app/services/data-module/pouch-db.service';


@Injectable()
export class PlayerService {

  private notificationId = 0;
  private quotes: Array<Quote> = null;
  private timeoutId: number;

  private state = {
    set count(x) {
      this.c = x;
      chrome.runtime.sendMessage({ msg: "updateState", data: this });
    },
    get count() { return this.c },
    c: 0,
    set running(x) {
      this.r = x;
      chrome.runtime.sendMessage({ msg: "updateState", data: this });
    },
    get running() { return this.r },
    r: false,
    time: 60000,
    playlists: [],
    playlist: null
  }


  constructor(private data: DataService, private pouchDb: PouchDbService) {
    let that = this;

    this.pouchDb.init()
      .then(() => {
        this.data.init(this.pouchDb);
        this.data.allPlaylists.subscribe(x => {
          this.state.playlists = x;
        });
      })

    chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
      if (id === "quote" + that.notificationId) {
        if (buttonIndex === 0) {
          chrome.notifications.clear(id);
          that.startTimer(that.state.time);
        } else if (buttonIndex === 1) {
          that.stopInterval();
          /* Icon muss auch von hier gesetzt werden, da Popup geschlossen sein kann*/
          chrome.browserAction.setIcon({ path: "../iconk.png" });
        }
      }
    });

    chrome.notifications.onClosed.addListener(function (id) {
      if (id === "quote" + that.notificationId) {
        that.startTimer(that.state.time);
      }
    });

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        switch (request.msg) {
          case "getState":
            sendResponse(that.state);
            break;
          case "startTimer":
            if (that.startInterval(request.time, request.playlist)) {
              sendResponse(that.state)
            };
            break;
          case "stopTimer":
            that.stopInterval();
            sendResponse(that.state);
            break;
          default:
            console.error("background script: Unidentified Message received ");
        }
      });

  }

  private stopInterval = function () {
    try {
      chrome.notifications.clear("quote" + this.notificationId);
      this.notificationId++;
      clearTimeout(this.timeoutId);
      this.state.running = false;
    }
    catch (error) { console.error('Could not clear notification: ' + error) }

  }

  private startInterval = function (duration, playlist) {
    this.state.running = true;
    this.state.time = duration || 60000;
    this.state.playlist = playlist;
    this.quotes = playlist.quoteDocs;
    return this.startTimer(this.state.time);
  }

  private drawText(canvas, text) {
    /*not Unit Tested*/

    let context = canvas.getContext("2d");

    canvas.id = "CursorLayer";
    canvas.width = 500;
    canvas.height = 350;

    const maxWidth = 440;
    const x = (canvas.width - maxWidth) / 2;
    const y = 15;

    this.wrapText(context, text, x, y, maxWidth);
    return canvas;
  }

  private wrapText(context, text, x, y, maxWidth) {
    /*not Unit Tested*/
    var words = text.split(' ');
    var line = '';
    let point, lineHeight;

    point = Math.ceil(300 / (words.length + 4)) + 12;
    context.font = point + "pt Calibri";
    context.fillStyle = 'white';
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

  private startTimer(time) {

    console.log(this.quotes);

    if (!this.quotes) {
      chrome.notifications.create("noPlaylistSelected", {
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

        let canvas = document.createElement('canvas');
        const text = this.quotes[this.state.count % this.quotes.length].quote;
        let paintedCanvas = this.drawText(canvas, text);

        var options = {
          type: "image",
          title: "A quote by " + this.quotes[this.state.count % this.quotes.length].author,
          message: this.quotes[this.state.count % this.quotes.length].quote.substring(0, 25) + ' ...',
          contextMessage: "Source: " + (this.quotes[this.state.count % this.quotes.length].source ? this.quotes[this.state.count % this.quotes.length].source : 'Unknown'),
          imageUrl: paintedCanvas.toDataURL('image/png'),
          buttons: [
            { title: "Next Quote" },
            { title: "Stop" }
          ],
          requireInteraction: true,
          iconUrl: "../iconm.png"
        };
        try { chrome.notifications.create("quote" + this.notificationId, options) }
        catch (error) { console.log('Could not create notification: ' + error) }
        this.state.count++;

      }, time);
      return true
    }

  }
}

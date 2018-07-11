/// <reference types="chrome/chrome-app"/>

import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';

@Injectable()
export class ChromeMessageService {

    constructor() {


    }

    sendMessage(message, data) {
        chrome.runtime.sendMessage({
            msg: message,
            data: data
        });
    }
}

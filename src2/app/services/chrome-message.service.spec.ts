import { TestBed, inject } from '@angular/core/testing';

import { ChromeMessageService } from './chrome-message.service';

const chrome = require('sinon-chrome');

describe('ChromeMessageService', () => {

  beforeAll(function () {
    Object.assign((global as any).chrome, chrome)
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChromeMessageService]
    });
  });

  it('should be created', inject([ChromeMessageService], (service: ChromeMessageService) => {
    expect(service).toBeTruthy();
  }));

  it('should sendMessage()', inject([ChromeMessageService], (service: ChromeMessageService) => {
    spyOn((global as any).chrome.runtime,'sendMessage');
    service.sendMessage("message","data");
    expect((global as any).chrome.runtime.sendMessage).toHaveBeenCalledWith({
      msg: 'message',
      data: 'data'
  })
  }));
});

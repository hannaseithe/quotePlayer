import { TestBed, inject } from '@angular/core/testing';

import { ChromeMessageService } from './chrome-message.service';

describe('ChromeMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChromeMessageService]
    });
  });

  it('should be created', inject([ChromeMessageService], (service: ChromeMessageService) => {
    expect(service).toBeTruthy();
  }));
});

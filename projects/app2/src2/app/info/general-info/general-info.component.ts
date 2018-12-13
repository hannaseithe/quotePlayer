import { Component, OnInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { Router } from '@angular/router';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  @ViewChildren('internalLink', { read: ElementRef }) contentItemsList;
  @ViewChild('mainContainer', { read: ElementRef }) mainContainer;
  contentItems = [];
  internallyScrolled = false;
  scrollingSubscription;

  constructor(private router: Router, private ref: ChangeDetectorRef, private scroll: ScrollDispatcher) {

    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.onWindowScroll(data);
      });
  }

  private onWindowScroll(data: CdkScrollable) {
    const offSet = data.getElementRef().nativeElement.scrollTop
    if (offSet === 0) {
      this.internallyScrolled = false;
    } else {
      this.internallyScrolled = true;
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.contentItems = this.contentItemsList.toArray();
    this.ref.detectChanges();

  }

  getText(item) {
    return item.nativeElement.querySelector('.mat-card-title').innerText
  }

  scrollTo(item) {

    item.nativeElement.scrollIntoView();

    this.internallyScrolled = true;
  }

  scrollBack() {

    this.internallyScrolled = false;
    this.mainContainer.nativeElement.scrollTop = 0;

  }



}

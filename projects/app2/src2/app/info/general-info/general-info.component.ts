import { Component, OnInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  @ViewChildren('internalLink', { read: ElementRef }) contentItems;
  internallyScrolled = false;

  constructor(private router: Router, private ref: ChangeDetectorRef, private el: ElementRef) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.contentItems.changes.subscribe((r) => {
      console.log(r)
    });

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
    this.el.nativeElement.scrollTop = 0;

  }



}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsNotificationInfoComponent } from './windows-notification-info.component';

describe('WindowsNotificationInfoComponent', () => {
  let component: WindowsNotificationInfoComponent;
  let fixture: ComponentFixture<WindowsNotificationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowsNotificationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowsNotificationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

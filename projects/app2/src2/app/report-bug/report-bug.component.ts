import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {

  sendSuccess = false;
  bugForm: FormGroup;
  user;
  userLoggedIn = true;
  constructor(private http: HttpClient,
    private formbuilder: FormBuilder) {

    this.bugForm = this.formbuilder.group({
      faulty: new FormControl(null, Validators.required),
      expected: new FormControl(null, Validators.required),
      reproduce: new FormControl(null, Validators.required),
      user: new FormControl(null, [Validators.required, Validators.email]),
    });

    chrome.identity.getProfileUserInfo(userInfo => {
      this.user = userInfo.email;
      this.userLoggedIn = this.user === "" ? false : true;
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.send(this.prepareData()).then(result => {
      this.sendSuccess = true;
      this.bugForm.reset();
    })
  }

  send(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post('http://www.hannaseithe.de/bug-mail.php', data, httpOptions).toPromise()
  }

  prepareData() {
    const formModel = this.bugForm.value;
    const chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];

    let OSName = "Unknown";

    if (navigator.userAgent.indexOf("Windows") != -1) {
      if (navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10"
      else if (navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8"
      else if (navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7"
      else if (navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista"
      else if (navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP"
      else if (navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000"
     
    }
    else if (navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS"
    else if (navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX"
    else if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux"

    return {
      form_user: this.userLoggedIn ? this.user : formModel.user,
      form_expected: formModel.expected,
      form_faulty: formModel.faulty,
      form_reproduce: formModel.reproduce,
      form_chromeVersion: chromeVersion,
      form_os: OSName
    }
  }

}

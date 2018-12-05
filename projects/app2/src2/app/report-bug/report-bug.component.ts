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
      bug: new FormControl(null, Validators.required),
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

    return {
      form_user: this.userLoggedIn ? this.user : formModel.user,
      form_msg: formModel.bug
    }
  }

}

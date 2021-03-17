import { AlertMessageComponent } from './../alert-message/alert-message.component';
import { Login } from './../models/login';
import { MainService } from './../service/main.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PleaseWaitComponent } from '../please-wait/please-wait.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginData: Login;
  constructor(private authService: MainService,
    private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog) { }



  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginUser() {
    const dialogRef = this.dialog.open(PleaseWaitComponent);
    this.loginData = this.loginForm.value;
    this.router.navigate(['/display-user']);
    sessionStorage.setItem('email', this.loginData.email);
    this.authService.loginUser(this.loginData).subscribe(
      data => {
        dialogRef.close();
        if (data.result === '' || data.result === null)
          this.dialog.open(AlertMessageComponent, { data: { message: 'Email/Password is wrong!!!' } });
        else {
          dialogRef.close();
          sessionStorage.setItem('Token', 'Bearer ' + data.result.accessToken);
          sessionStorage.setItem('RefreshToken', 'Bearer ' + data.result.refreshToken);
          this.router.navigate(['/display-user']);
        }
      },
      err => {
        dialogRef.close();
        if (err.message != null) {
          this.dialog.open(AlertMessageComponent, { data: { message: 'Something Went Wrong' } });
        }
      }
    );
  }
}

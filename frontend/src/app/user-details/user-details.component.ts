import { User } from './../models/user';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { PleaseWaitComponent } from '../please-wait/please-wait.component';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  constructor(private mainService: MainService, private dialog: MatDialog) { }
  userInfo: User = new User();

  ngOnInit(): void {
    const dialogRef = this.dialog.open(PleaseWaitComponent);
    this.mainService.getUser(sessionStorage.getItem('Token'), sessionStorage.getItem('email')).subscribe(
      data => {
        dialogRef.close();
        if (data.result === '' || data.result === null)
          this.dialog.open(AlertMessageComponent, { data: { message: 'Something Went Wrong' } });
        else {
          this.userInfo = data.result;
          dialogRef.close();

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

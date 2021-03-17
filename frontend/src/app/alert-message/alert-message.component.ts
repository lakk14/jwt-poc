import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {
  message: string;
  constructor(@Inject(MAT_DIALOG_DATA)public data: any, private dialogRef: MatDialogRef<AlertMessageComponent>) {}

  ngOnInit() {
    this.message = this.data.message;
  }

  onDismiss() {
    this.dialogRef.close();
  }

}

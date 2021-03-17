import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-please-wait',
  templateUrl: './please-wait.component.html',
  styleUrls: ['./please-wait.component.css']
})
export class PleaseWaitComponent implements OnInit {

  constructor(dialogRef: MatDialogRef<PleaseWaitComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

}

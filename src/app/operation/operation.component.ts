import { GetDataService } from '../services/get-data.service';
import { Component, OnInit } from '@angular/core';
import { Data } from '../models/data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.component.html',
  styleUrls: ['operation.component.css'],
})
export class Operation implements OnInit {
  operations: Data[] = [];

  constructor(private ioService: GetDataService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.snackBar.open('Welcome!', 'close', {
      duration: 2000
    });

    this.ioService.fetchOperations().subscribe(
      items => {
        this.operations = this.ioService.calculate(items);
      }, err => {
        this.snackBar.open('Server Error', 'close');
      }
    );
  }

}
import { Injectable } from '@angular/core';
import { Data } from '../models/data.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GetDataService { // a service for IO and data handling
  
  constructor(private http: HttpClient) { } // defined HttpClient to be used as http

  fetchOperations() {
    return this.http.get('../../../assets/numbers.json')
    .pipe(
      mergeMap(number => {
        return this.http.get('../../../assets/add.json').pipe(
          // returns an Observable<Object> to be fetched in subscribe method
          catchError(() => of({ value: 'Missing Data!' })),
          map(add => {
            // maps data to corresponding structure for further manipulation
            return { number: number, addOperand: add }
          }),
          mergeMap((data: any) => {
            return this.http.get('../../../assets/multiply.json')
            .pipe(
              // returns an Observable<Object> to be fetched in subscribe method
              catchError(() => of({ value: 'Missing Data!' })),
              map(multipy => {
                // maps data to corresponding structure for further manipulation
                return { ...data, multiplyOperand: multipy }
              })
            )
          })
        )
      })
    );
  }

  calculate(obj: any) {
    const results: Data[] = [];

    for(const it of obj.number) {
      if(
        (it.action === 'multiply' && !obj.multiplyOperand)
        || (it.action === 'add' && !obj.addOperand)
      ) continue;

      results.push({
        x: it.value,
        y: it.action === 'multiply' ? obj.multiplyOperand.value : obj.addOperand.value,
        action: it.action,
        result: it.action === 'multiply' ? (it.value * obj.multiplyOperand.value) : (it.value + obj.addOperand.value),
      })
    }

    return results;
  }

}
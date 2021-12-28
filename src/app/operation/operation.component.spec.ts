import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Operation } from './operation.component';
import { GetDataService } from '../services/get-data.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('Operation', () => {
    let component: Operation;
    let fixture: ComponentFixture<Operation>;
    let userService: GetDataService;
    let snack: MatSnackBar;

    beforeEach(() => {
        const SpyObject = jasmine.createSpyObj('GetDataService', ['calculate', 'fetchOperations'])
        const SpyMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open'])

        TestBed.configureTestingModule({
          declarations: [
            Operation
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [
              {
                provide: MatSnackBar,
                useValue: SpyMatSnackBar
              },
              {
                provide: GetDataService,
                useValue: SpyObject
              }
          ]}
        ).compileComponents();

        fixture = TestBed.createComponent(Operation);
        userService = fixture.debugElement.injector.get(GetDataService);
        snack = fixture.debugElement.injector.get(MatSnackBar);
        userService.fetchOperations = () => {
            return of([]);
        }
        userService.calculate = (item) => {
            return [];
        }
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should have 2 operations shown up', () => {
        userService.fetchOperations = () => {
            return of([
              { action: 'add', x: 2, y: 4, result: 6 },
              { action: 'add', x: 2, y: 5, result: 7 }
            ]);
        }

        userService.calculate = (item) => {
            return item;
        }

        component.ngOnInit();
        fixture.detectChanges();
        const bannerDe: DebugElement = fixture.debugElement;
        const paragraphDe = bannerDe.queryAll(By.css('.title'));
        expect(paragraphDe.length).toBe(2);
      })


      it('should open snackBar with "Server Error" on server error', () => {
        userService.fetchOperations = () => {
            return throwError('Server Error');
        }
        component.ngOnInit();
        expect(snack.open).toHaveBeenCalledWith('Server Error', 'close');
      })

})
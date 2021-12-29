import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { GetDataService } from './get-data.service';
import { of, throwError } from 'rxjs';

// @TODO: Add marble tests (rxjs/tests)

describe('GetDataService', () => {
  let service: GetDataService;
  let http: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        GetDataService,
        {
          provide: HttpClient,
          useValue: httpClientSpy
        }
      ]
    });

    service = TestBed.inject(GetDataService);
    http = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('fetchOperations should return an Observable',
  (done: DoneFn) => {
    http.get.withArgs('../../../assets/numbers.json').and.returnValue(of('numberValue'));
    http.get.withArgs('../../../assets/add.json').and.returnValue(of('addValue'));
    http.get.withArgs('../../../assets/multiply.json').and.returnValue(of('multiplyValue'));
    
    service.fetchOperations().subscribe(
      output => {
        const expected = {
          number: 'numberValue',
          addOperand: 'addValue',
          multiplyOperand: 'multiplyValue'
        };

        expect(output).toEqual(expected);
        done();
      }
    )
  })

  it('should throw "Server Error" on numbers.json loading failure',
  (done: DoneFn) => {
    http.get.withArgs('../../../assets/numbers.json').and.returnValue(throwError('Server Error'));

    service.fetchOperations().subscribe(() => {},
      err => {
        expect(err).toEqual('Server Error');
        done();
      }
    )
  })
  
  it('should return "Missing Data!" in addOperand on add.json loading failure',
  (done: DoneFn) => {
    http.get.withArgs('../../../assets/numbers.json').and.returnValue(of('numberValue'));
    http.get.withArgs('../../../assets/add.json').and.returnValue(throwError('Missing Data!'));
    http.get.withArgs('../../../assets/multiply.json').and.returnValue(of('multiplyValue'));

    service.fetchOperations().subscribe(
      output => {
        const expected = {
          number: 'numberValue',
          addOperand: {value: 'Missing Data!'},
          multiplyOperand: 'multiplyValue'
        };

        expect(output).toEqual(expected);
        done();
      }
    )
  })

  it('should return "Missing Data!" in multiplyOperand on multiply.json loading failure',
  (done: DoneFn) => {
    http.get.withArgs('../../../assets/multiply.json').and.returnValue(throwError('Missage Data!'));
    http.get.withArgs('../../../assets/add.json').and.returnValue(of('addValue'));
    http.get.withArgs('../../../assets/numbers.json').and.returnValue(of('numberValue'));

    service.fetchOperations().subscribe(
      output => {
        const expected = {
          number: 'numberValue',
          addOperand: 'addValue',
          multiplyOperand: {
            value: 'Missing Data!'
          }
        };

        expect(output).toEqual(expected);
        done();
      }
    )
  })

  // Add tests

  it('calculate function should return 12 as the result of 3 + 9 operation', () => {
    let res: any[] = [];

    const inputObj = {
      number: [
        {
          value: 3,
          action : 'add'
        }
      ],
      addOperand: {
        value: 9
      }
    };
    
    res = service.calculate(inputObj)
    expect(res[0].result).toBe(12)
  })

  it('calculate function should return 226 as the result of 49 + 177 operation', () => {
    let res: any[] = [];

    const inputObj = {
      number: [
        {
          value: 49,
          action : 'add'
        }
      ],
      addOperand: {
        value: 177
      }
    };
    
    res = service.calculate(inputObj)
    expect(res[0].result).toBe(226)
  })

  it('calculate function should return 134 as the result of 78 + 56 operation', () => {
    let res: any[] = [];

    const inputObj = {
      number: [
        {
          value: 78,
          action : 'add'
        }
      ],
      addOperand: {
        value: 56
      }
    };
    
    res = service.calculate(inputObj)
    expect(res[0].result).toBe(134)
  })

  // Multiply tests

  it('calculate function should return 50 as the result of 5 * 10 operation', () => {
    let res: any[] = [];

    const inputObj = {
      number: [
        {
          value: 5,
          action : 'multiply'
        }
      ],
      multiplyOperand: {
        value: 10
      }
    };
    
    res = service.calculate(inputObj)
    expect(res[0].result).toBe(50)
  })

  it('calculate function should return 1863 as the result of 23 * 81 operation', () => {
    let res: any[] = [];

    const inputObj = {
      number: [
        {
          value: 23,
          action : 'multiply'
        }
      ],
      multiplyOperand: {
        value: 81
      }
    };
    
    res = service.calculate(inputObj)
    expect(res[0].result).toBe(1863)
  })

  it('calculate function should return -1863 as the result of -57 * 897 operation', () => {
    let res: any[] = [];

    const inputObj = {
      number: [
        {
          value: -57,
          action : 'multiply'
        }
      ],
      multiplyOperand: {
        value: 897
      }
    };
    
    res = service.calculate(inputObj)
    expect(res[0].result).toBe(-51129)
  })

  it('should return empty result as action is multiply and no multiplyOperand is provided', () => {
    let res : any[] = [];

    const inputObj = {
      number: [
        {
          value: 5,
          action : 'multiply'
        }
      ],
      addOperand: {
        value: 6
      }
      // no multiplyOperand provided while the operation action is multiply
      // calculate function should skip this operation, hence the empty results
    };

    res = service.calculate(inputObj)
    expect(res.length).toBe(0);
  })

  it('should return empty result as action is add and no addOperand is provided', () => {
    let res : any[] = [];

    const inputObj = {
      number: [
        {
          value: 1,
          action : 'add'
        }
      ],
      multiplyOperand: {
        value: 14
      }
      // no addOperand provided while the operation action is add
      // calculate function should skip this operation, hence the empty results
    };

    res = service.calculate(inputObj)
    expect(res.length).toBe(0);
  })

});
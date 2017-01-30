import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from "RxJS/Rx";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Passage } from '../models/passage-model'

/*
  Generated class for the Passages provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class PassagesService {
  constructor(private http: Http) { }

  private prefix: string = "http://localhost:3000";

  getPassages(): Observable<Passage[]> {
    return this.http.get(this.prefix + "/passages")
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPassage(id: number): Observable<Passage> {
    return this.http.get(`${this.prefix}/passages/${id}`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  addPassage(title: string, text: string): Promise<Passage> {
    var nextId: number = Number(this.getPassages().subscribe(Result => Result.length)) + 1; //One greater than greatest id number

    const passageToAdd = new Passage(nextId,
                                title,
                                text,
                                false,
                                false,
                                0);
    return this.http
      .post(this.prefix + "/passages", passageToAdd)
      .toPromise()
      .catch(err => console.error(err));
  }
}

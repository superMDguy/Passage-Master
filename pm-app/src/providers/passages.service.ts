import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from "RxJS/Rx";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { Passage } from '../models/passage-model'

/*
  Generated class for the Passages provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class PassagesService {
  constructor(private http: Http) { }

  private cachedPassages: Passage[];
  private prefix: string = "http://localhost:3001";

  getPassages(): Promise<Passage[]> {
    return this.http.get(this.prefix + "/passages")
      .toPromise()
      .then((res) => {
        this.cachedPassages = res.json();
        return res.json();
      });
  }

  addPassage(title: string, text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getPassages().then(
      (passages) => {
        let nextId: number = passages.length + 1;

        let passageToAdd: Passage = {
          id: nextId,
          title: title,
          text: text,
          mastered: false,
          currentPassage: false,
          reviewed: 0
        };

        console.log("Adding passage " + JSON.stringify(passageToAdd))
        this.cachedPassages.push(passageToAdd);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http
          .post(this.prefix + "/passages", passageToAdd, options)
          .toPromise()
          .catch(err => console.error(err))
          .then((res: Response) => {
            resolve();
          })
      })
    });
  }

  deletePassage(id: number): Promise<Response> {
    return this.http
      .delete(this.prefix + '/passages/' + id.toString())
      .toPromise();
  }
}
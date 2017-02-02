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
  constructor(private http: Http) {}

  private cachedPassages: Passage[];
  private prefix: string = "http://localhost:3000";

  getPassages(): Promise<Passage[]> {
    if (this.cachedPassages == undefined) {
      return this.http.get(this.prefix + "/passages")
        .toPromise()
        .then((res) => {
          this.cachedPassages = res.json();
        });
    } else {
      console.log("Sending cached")
      return new Promise<Passage[]>(
        (resolve, reject) => {
          resolve(this.cachedPassages)
        }
      );
    }
  }

  addPassage(title: string, text: string) {
    var nextId: number;
    this.getPassages().then(
      (passages) => {
        nextId = passages.length;

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

        this.http
          .post(this.prefix + "/passages", JSON.stringify(passageToAdd))
          .toPromise()
          .catch(err => console.error(err));
      });
  }
}

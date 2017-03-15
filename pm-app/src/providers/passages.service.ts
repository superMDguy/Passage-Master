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
  private prefix: string = "/api";

	private oddeven = ['odd', 'even']
  private days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	private dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
									 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
									 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
	private frequencyChoices = {days: this.days, oddeven: this.oddeven, dates: this.dates};

  getPassages(): Promise<Passage[]> {
    return this.http.get(this.prefix + "/passages")
      .toPromise()
      .then((res) => {
        this.cachedPassages = res.json();
        return res.json();
      });
  }

  shouldShowPassage(frequency: string) {
    let date = new Date();
    if (frequency == "daily") {
      return true;
    }

    if (frequency == "odd" && date.getDate() % 2 == 1
      || frequency == "even" && date.getDate() % 2 == 0) {
      return true;
    }

    let dayIndex = this.days.indexOf(frequency);

    if (dayIndex == date.getDay()) {
      return true;
    }

    if (!isNaN(Number(frequency)) && Number(frequency) == date.getDate()) {
      return true;
    }

    return false;
  }

  getPassagesForToday(): Promise<Passage[]> {
    return this.http.get(this.prefix + "/passages")
      .toPromise()
      .then((res) => {
        let body = res.json();
        return body.filter((passage) => {
          return this.shouldShowPassage(passage.reviewFrequency);
        });
      });
  }

	sortPassagesByReviewType(passages: Passage[]): any  {
		let sortedPassages = {
							daily: [],
							oddeven: [],
							weekday: [],
							date: []
						};

			for (let passage of passages) {
				let frequency = passage.reviewFrequency;

				if (frequency == "daily") {
					sortedPassages.daily.push(passage);
				} else if (frequency == "odd" || frequency == "even") {
					sortedPassages.oddeven.push(passage);
				} else if (this.days.indexOf(frequency) != -1) {
					sortedPassages.weekday.push(passage);
				} else if (!isNaN(Number(frequency))) {
					sortedPassages.date.push(passage);
				}
			}

		for (let category of Object.keys(sortedPassages)) {
			sortedPassages[category].sort(function(a, b) { //Sort by date created
	       		let x = new Date(a.created);
				let y = new Date(b.created);
        		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		    });
		}

		return sortedPassages;
	}

 	_random(arr: Array<any>) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	master(_id: number): Promise<any> {
 		return this.getPassages().then((passages) => {
				let sortedPassages = this.sortPassagesByReviewType(passages);

//				let totalLength = passages.length;
//				let idealLength = (totalLength / (Object.keys(sortedPassages).length)); //Ideal # of passages per section

				let promises = [];

        var passageToModify: any = null;
				for (let passage of sortedPassages.daily) {
					if (passage._id == _id) {
						var passageToModify = passage;
					}
				}

				for (let category of Object.keys(sortedPassages).slice(1)) {

					if (sortedPassages[category].length > 0) {
            console.log(sortedPassages[category])
						let newPassage = sortedPassages[category][0]; //Select first (oldest) passage in category
						passageToModify.reviewFrequency = newPassage.reviewFrequency;
						promises.push(
							this.http.put(this.prefix + "/passages/" + _id.toString(), passageToModify)
								.toPromise()
							);
						passageToModify = newPassage;

					} else { //No passages in this category, can't move anything else up a category
						let newPassage = {reviewFrequency: null};
						newPassage.reviewFrequency = this._random(this.frequencyChoices[category]);
						promises.push(
							this.http.put(this.prefix + "/passages/" + _id.toString(), newPassage)
								.toPromise()
							);

						break;
					}

				}
			return Promise.all(promises);
		});
 }


//  getPassage(_id: number): Promise<Passage> {
//    return this.http.get(this.prefix + "/passages/" + _id.toString())
//      .toPromise()
//      .then((res) => {
//        return res.json();
//      });
//  }

  addPassage(title: string, text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getPassages().then(
        (passages) => {
          let nextId: number = passages.length + 1;

          let passageToAdd: Passage = {
            _id: nextId,
            title: title,
            text: text,
            reviewFrequency: 'daily',
						created: new Date()
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

  deletePassage(_id: number): Promise<Response> {
    return this.http
      .delete(this.prefix + '/passages/' + _id.toString())
      .toPromise();
  }
}

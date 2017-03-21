import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PassagesService } from '../../providers/passages.service';
import { Passage } from '../../models/passage-model';
import { PassagePage } from '../passage/passage';
/*
  Generated class for the Passages page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-all-passages',
  templateUrl: 'all-passages.html',
  providers: [PassagesService]
})

export class AllPassagesPage {
  @Input() sortedPassages: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private passagesService: PassagesService) { }

  ionViewCanEnter(): Promise<boolean> {
    return this.passagesService.getPassages()
      .then((passages: Passage[]) => {
        this.sortedPassages = this.passagesService.sortPassagesByReviewType(passages);
        return true;
      });
  }

  itemTapped(event, passage) {
    this.navCtrl.push(PassagePage, {
      passage: passage,
      _id: passage._id
    });
  }
}


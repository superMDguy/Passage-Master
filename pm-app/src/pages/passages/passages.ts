import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PassagesService } from '../../providers/passages.service';
import { Passage } from '../../models/passage-model';
import { PassagePage } from '../passage/passage';
import { AddPassagePage } from '../add-passage/add-passage'
/*
  Generated class for the Passages page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-passages',
  templateUrl: 'passages.html',
  providers: [PassagesService]
})

export class PassagesPage {
  @Input() passages: Array<Passage>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private passagesService: PassagesService) {
    this.passagesService.getPassages()
    .then ((passages: Array<Passage>) => this.passages = passages);
  }

  itemTapped(event, passage) {
    console.log("Clicked!  Showing passage", passage);
    this.navCtrl.push(PassagePage, {
      passage: passage,
      _id: passage._id
    });
  }

  addPassage() {
    this.navCtrl.push(AddPassagePage)
  }
}

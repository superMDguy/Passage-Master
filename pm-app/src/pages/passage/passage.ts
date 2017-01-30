import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Passage } from '../../models/passage-model';
import { PassagesService } from '../../providers/passages.service';
/*
  Generated class for the Passage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-passage',
  templateUrl: 'passage.html',
  providers: [PassagesService]
})
export class PassagePage {
  passage: Passage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private passagesService: PassagesService) {
    this.passage = navParams.get('passage');
  }

}

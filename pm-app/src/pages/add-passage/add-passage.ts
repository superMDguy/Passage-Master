import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PassagesService } from '../../providers/passages.service';

/*
  Generated class for the AddPassage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-passage',
  templateUrl: 'add-passage.html',
  providers: [PassagesService],
})

export class AddPassagePage {
  title: string;
  text: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private passagesService: PassagesService) { }

  add() {
    this.passagesService.addPassage(this.title, this.text)
      .then((res: any) => {
        this.navCtrl.pop()
      })
  }
}
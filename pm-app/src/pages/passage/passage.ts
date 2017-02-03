import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Passage } from '../../models/passage-model';
import { PassagesService } from '../../providers/passages.service';
import { PassagesPage } from '../passages/passages';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private passagesService: PassagesService, public alertCtrl: AlertController) {
    this.passage = navParams.get('passage');
  }

  delete() {
    let confirm = this.alertCtrl.create({
      title: `Delete ${this.passage.title}?`,
      message: `Are you sure you want to delete ${this.passage.title}`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.passagesService.deletePassage(this.passage.id)
              .then((res: any) => {
                this.navCtrl.push(PassagesPage);
              })
          }
        }
      ]
    });
    confirm.present();
  }
}

import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Passage } from '../../models/passage-model';
import { PassagesService } from '../../providers/passages.service';
import { PassagesPage } from '../passages/passages';
import { GamePage } from '../game/game';

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
  @Input() passage: Passage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private passagesService: PassagesService, public alertCtrl: AlertController) {
    // if (typeof navParams.get('passage') == typeof undefined) {
    this.passage = navParams.get('passage'); //TODO: Fix commented stuff so it work #/passgases/<id> is reloaded
    // } else {
    //   this.passagesService.getPassage(1) //TODO: Replace this with the id in the URL
    //     .then((passage: Passage) => this.passage = passage);
    // // }
  }

  delete() {
    let confirm = this.alertCtrl.create({
      title: `Delete "${this.passage.title}"?`,
      message: `Are you sure you want to delete "${this.passage.title}"`,
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
            this.passagesService.deletePassage(this.passage._id)
              .then((res: any) => {
                this.navCtrl.push(PassagesPage);
              })
          }
        }
      ]
    });
    confirm.present();
  }

  playGame() {
    this.navCtrl.push(GamePage, {
      passage: this.passage,
      _id: this.passage._id
    })
  }
}

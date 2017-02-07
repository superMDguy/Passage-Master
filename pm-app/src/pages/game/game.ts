import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Passage } from '../../models/passage-model';
import { PassagesService } from '../../providers/passages.service';
/*
  Generated class for the Game page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})

export class GamePage {
  passage: Passage;
  text: string;
  words: string[];
  answer: string;
  color: string;
  correctAnswer: string;

  removePunctuation(s: string): string {
    let punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    return punctuationless.replace(/\s{2,}/g, " ");
  }

constructor(public navCtrl: NavController, public navParams: NavParams) {  
  }

  ngOnInit() {
    this.passage = this.navParams.get('passage');
    this.words = this.passage.text.split(" ");
    this.nextQuestion();
  }

  nextQuestion() {
    this.color = "#000000"
    console.log(this)
    let randomIndex = Math.floor((Math.random() * (this.words.length - 1)) + 1);
    this.text = this.words.slice(0, randomIndex).join(" "); //All words up to a random index
    this.correctAnswer = this.removePunctuation(this.words[randomIndex]);
    this.answer = null;
  }

  check() {
    if (this.answer == this.correctAnswer) {
      this.color = "#00FF00";
      setTimeout(() => this.nextQuestion(), 1000);
    }
  }
}
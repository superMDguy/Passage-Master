import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Passage } from '../../models/passage-model';
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
    let punctuationless = s.replace(/[.,\/#!$%\^&\*\?;:{}=\-_`~()]/g, "");
    return punctuationless.replace(/\s{2,}/g, " ");
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.passage = this.navParams.get('passage');
    //Remove extra spaces, then split into words
    this.words = this.passage.text.replace(/ +(?= )/g, '').split(" ");
    this.nextQuestion();
  }

  nextQuestion() {
    this.color = "#000000"
    let randomIndex = Math.floor((Math.random() * (this.words.length - 1)) + 1);
    this.text = this.words.slice(0, randomIndex)
      .join(" "); //All words up to a random index
    this.correctAnswer = this.words[randomIndex];
    this.answer = null;
  }

  areEqual(str1: string, str2: string): boolean {
    if (str1 && str2) {
      return this.removePunctuation(str1).trim().toUpperCase()
        == this.removePunctuation(str2).trim().toUpperCase();
    }
    return false;
  }

  check() {
    if (this.areEqual(this.answer, this.correctAnswer)) {
      this.color = "#00FF00";
      setTimeout(() => this.nextQuestion(), 1000);
    }
  }
}

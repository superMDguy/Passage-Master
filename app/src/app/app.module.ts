import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { PassagesPage } from '../pages/passages/passages';
import { PassagePage } from '../pages/passage/passage';
import { AddPassagePage } from '../pages/add-passage/add-passage';
import { AllPassagesPage } from '../pages/all-passages/all-passages';
import { GamePage } from '../pages/game/game';

@NgModule({
  declarations: [
    MyApp,
    PassagesPage,
    PassagePage,
    AddPassagePage,
    GamePage,
    AllPassagesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
      links: [{ component: PassagesPage, name: 'Passages', segment: 'passages' },
      {component: PassagePage, name: 'Passage', segment: 'passages/:_id' },
      {component: AddPassagePage, name: 'Add Passage', segment: 'addPassage' },
      {component: GamePage, name: "Play Game", segment: 'playGame/:_id'},
      {component: AllPassagesPage, name: "All Passages", segment: "all-passages"}],
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    CommonModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PassagesPage,
    PassagePage,
    AddPassagePage,
    GamePage,
    AllPassagesPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }

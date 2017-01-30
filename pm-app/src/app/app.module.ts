import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { PassagesPage } from '../pages/passages/passages';
import { PassagePage } from '../pages/passage/passage';
import { AddPassagePage } from '../pages/add-passage/add-passage';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    PassagesPage,
    PassagePage,
    AddPassagePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
      links: [{ component: PassagesPage, name: 'Passages', segment: 'passages' },
      {component: PassagePage, name: 'Passage', segment: 'passages/:passage.id' },
      {component: AddPassagePage, name: 'Add Passage', segment: 'passages/add' }]
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
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    PassagesPage,
    PassagePage,
    AddPassagePage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }

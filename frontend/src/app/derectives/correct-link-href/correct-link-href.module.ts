/**
 * @author [Aleksandr Kinash]
 * @email [aleksandrkinash90@gmail.com]
 * @create date 2019-04-02 11:24:10
 * @modify date 2019-04-02 11:24:10
 * @desc [description]
 */
import { NgModule } from '@angular/core';
import { CorrectLinkHrefDirective } from './correct-link-href.directive';

@NgModule({
  declarations: [ CorrectLinkHrefDirective ],
  exports: [ CorrectLinkHrefDirective ]
})
export class CorrectLinkHrefModule {}

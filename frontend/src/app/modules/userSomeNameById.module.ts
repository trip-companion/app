import { NgModule } from '@angular/core';
import { userSomeNameByIdPipe } from '@app/pipe/user-someName-byId-ui';

@NgModule({
  imports: [],
  declarations: [userSomeNameByIdPipe],
  exports: [userSomeNameByIdPipe]
})
export class uiSomeNameByIdModule { }

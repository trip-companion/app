import { Pipe, PipeTransform } from '@angular/core';
import { ENUM_USER_LANGUAGE } from '@app/DATA/account-data';

@Pipe({
  name: 'userLangLvl',
  pure: true,
})
export class UserLanguageLvlPipe implements PipeTransform {
  transform(langEnum: string, langSite: string): string | null {
    return ENUM_USER_LANGUAGE[langEnum][langSite];
  }
}



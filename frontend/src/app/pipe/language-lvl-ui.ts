import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userLangLvl',
  pure: true,
})
export class UserLanguageLvlPipe implements PipeTransform {
  transform(langEnum: string, languagesStaticData: string): string | null {
    return languagesStaticData[langEnum].text;
  }
}



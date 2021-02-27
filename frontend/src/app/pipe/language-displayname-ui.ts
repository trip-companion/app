import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userLanguagesNameByIso',
  pure: true,
})
export class UserLanguagesNameByIsoPipe implements PipeTransform {
  transform(isoCode: string, arrayOfLang: {isoCode: string; displayName: string}[]): string {
    return arrayOfLang.find(obj => obj.isoCode === isoCode).displayName;
  }
}



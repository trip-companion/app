import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userYearsOld',
  pure: true,
})
export class UserYearsOldPipe implements PipeTransform {
  transform(dateOfBirth: any, yearsName: string): string | null {
    return dateOfBirth? Math.abs(dateOfBirth.diff(new Date(), 'years')) + ' ' + yearsName : null;
  }
}



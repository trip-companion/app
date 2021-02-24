import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userYearsOld',
  pure: true,
})
export class UserYearsOldPipe implements PipeTransform {
  transform(dateOfBirth: any): string | null {
    return dateOfBirth? Math.abs(dateOfBirth.diff(new Date(), 'years')) + ' years old.' : null;
  }
}



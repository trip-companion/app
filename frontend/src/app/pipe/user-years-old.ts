import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'user-years-old',
  pure: false,
})
export class UserYearsOldPipe implements PipeTransform {

  transform(args?: any): string {
    console.log(args);
    return '444';
  }
}



import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userInterestsNameById',
  pure: true,
})
export class UserInterestsNameByIdPipe implements PipeTransform {
  transform(currentId: string, arrayOfInterests: {id: string; displayName: string}[]): string {
    return arrayOfInterests.find(obj => obj.id === currentId).displayName;
  }
}



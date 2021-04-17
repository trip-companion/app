import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userSomeNameById',
  pure: true,
})
export class userSomeNameByIdPipe implements PipeTransform {
  transform(currentId: string, array: {id: string; displayName: string}[]): string {
    return array.find(obj => obj.id === currentId).displayName;
  }
}



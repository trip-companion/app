import { J } from '@angular/cdk/keycodes';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userCheckFeatures',
  pure: true,
})
export class UserCheckFeaturesPipe implements PipeTransform {
  transform(currentFeatures: {id: string; displayName: string}, userFeatures: string[]): boolean {
    return userFeatures.length>0?userFeatures.findIndex(featureId => currentFeatures.id === featureId)+1?false:true:true;
  }
}



import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tripCardSizingDescription',
  pure: true,
})
export class TripCardSizingDescriptionPipe implements PipeTransform {


  static trimString(fullDescription: string, sizeLimit: number): string {
    // const fristPartStr: string;
    // const secondPartStr: string;
    const moreSymbol = '...';


    return fullDescription.substr(1, 200) + moreSymbol;
  }

  transform(fullDescription: string, sizeLimit: number, activeStatus: boolean): string {
    if(activeStatus) {return fullDescription;}

    return TripCardSizingDescriptionPipe.trimString(fullDescription, sizeLimit);
  }
}



import { Injectable} from '@angular/core';

import { ITravelCategory } from '@app/interfaces/store/userTripList';
import { TRIP_CATEGORY } from '@app/DATA/HARD/trip-category.hard';

@Injectable()
export class UserTripService {
  public availableUserCategories: ITravelCategory[] = TRIP_CATEGORY;
  constructor() {}

  public filterCategories(value: string, availableUserCategoriesForUser: ITravelCategory[]): ITravelCategory[] {
    const filterValue = value.toLowerCase();
    return availableUserCategoriesForUser.filter(category => category.displayName.toLowerCase().indexOf(filterValue) === 0);
  };

  public setAvailableCategoryForUser(userCategoriesChoices: string[]): ITravelCategory[] {
    const newArr = userCategoriesChoices.length === 0
      ? this.availableUserCategories
      : this.availableUserCategories.filter(({id: idInAll}) => !userCategoriesChoices.find((currentId) => currentId === idInAll));
    return newArr;
  };

}

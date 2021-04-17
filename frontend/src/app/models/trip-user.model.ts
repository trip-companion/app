import { IUserTrip } from '@app/interfaces/store/userTripList';

export class UserTripModel implements IUserTrip {
  public id: string;
  public userId: string;
  public status: boolean;
  public statusDate: string;
  public travelCategiries: Array<string>;
  public travelDescription: string;
  public destination: string;
  public startTrip: string;
  public endTrip;
  public peopleCount: number;

  constructor(values: IUserTrip) {
    Object.assign(this, values);
  };
};

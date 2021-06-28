import IUserModel from '@app/interfaces/store/user';
import { environment } from '@environments/environment';

const defaultUserAvatar = '/assets/images/account/avatar_icon.png';

export class UserModel implements IUserModel {
  public firstName: string;
  public lastName: string;
  public _status: string;
  public _gender: string;
  public about: string;
  public _birthDate: string;
  public languages: {isoCode: string; level: string}[];
  public knownSkills: string[];
  public interestedInSkills: string[];
  public canTeachSkills: string[];
  public interests: string[];
  public features: string[];
  public email: string;
  public id: string;
  private _avatarSrc: string;

  constructor(values: IUserModel) {
    Object.assign(this, values);
  };

  public set avatarSrc(value) {
    this._avatarSrc = value === ''?defaultUserAvatar:environment.host + value;
  }

  public get avatarSrc(): string {
    return this._avatarSrc;
  }

  public set birthDate(value) {
    this._birthDate = value?value:'1945-01-01';
  }

  public get birthDate(): string {
    return this._birthDate;
  }

  public set status(value) {
    this._status = value?value:'AT_HOME';
  }

  public get status(): string {
    return this._status;
  }

  public set gender(value) {
    this._gender = value?value:'FEMALE';
  }

  public get gender(): string {
    return this._gender;
  }
};

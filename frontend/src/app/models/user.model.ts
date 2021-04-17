import IUserModel from '@app/interfaces/store/user';
import { environment } from '@environments/environment';

const defaultUserAvatar = '/assets/images/account/avatar_icon.png';

export class UserModel implements IUserModel {
  public firstName: string;
  public lastName: string;
  public status: string;
  public gender: string;
  public about: string;
  public birthDate: string;
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
};

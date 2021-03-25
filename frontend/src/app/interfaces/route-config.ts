import ILocalizationText from './localization-text';

export interface IRouterChildConfig {
  url: string;
  name: ILocalizationText;
  pagination: boolean;
}

export interface IRouteConfig {
  url: string;
  name: ILocalizationText;
  mainMenu: boolean;
  availability: boolean;
  coreUrl?: string;
  childConfig?: IRouterChildConfig[];
  linkWithAvatar?: boolean;
}

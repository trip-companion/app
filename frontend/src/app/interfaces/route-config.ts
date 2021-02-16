import ILocalizationText from './localization-text';

export default interface IRouteConfig {
  url: string;
  name: ILocalizationText;
  availability?: boolean;
  coreUrl?: string;
  childConfig?: IRouteConfig[];
}

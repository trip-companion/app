import ILocalizationText from "./localization-text";

export default interface IRouteConfig {
	url: string;
	name: ILocalizationText;
	coreUrl?: string;
	childConfig?: IRouteConfig[];
}

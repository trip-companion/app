import IRouteConfig from "../interfaces/route-config";

export const ROUTER_CONFIG: IRouteConfig[] = [
	{
		url: '/',
		name: {
			ru: `Главная`,
			ua: `Головна`,
			en: `Home`
		}
	},
	{
		url: 'login/',
		name: {
			ru: `Портфолио`,
			ua: `Портфоліо`,
			en: `Portfolio`
		}
	},
	{
		url: 'sign-up/',
		name: {
			ru: `Цены`,
			ua: `Ціни`,
			en: `Prices`
		}
	}
];
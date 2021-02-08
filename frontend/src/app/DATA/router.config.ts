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
	},
	{
		url: 'faq/',
		name: {
			ru: `faq`,
			ua: `faq`,
			en: `faq`
		}
	},
	{
		url: 'account/',
		name: {
			ru: `Аккаунт`,
			ua: `Кабінет`,
			en: `Account`
		}
	}
];
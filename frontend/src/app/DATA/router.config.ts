import IRouteConfig from "@app/interfaces/route-config";
import ILocalizationText from "@app/interfaces/localization-text";

export const ROUTER_CONFIG: IRouteConfig[] = [
	{
		url: '/',
		name: {
			ru: `Главная`,
			ua: `Головна`,
			en: `Home`
		},
		availability: false
	},
	{
		url: 'login/',
		name: {
			ru: `Авторизация`,
			ua: `Увійти`,
			en: `Log In`
		},
		availability: true
	},
	{
		url: 'sign-up/',
		name: {
			ru: `Зарегистрироваться`,
			ua: `Зареєструватися`,
			en: `Sing up`
		},
		availability: true
	},
	{
		url: 'account/',
		name: {
			ru: `Аккаунт`,
			ua: `Кабінет`,
			en: `Account`
		},
		availability: false
	},
	{
		url: 'faq/',
		name: {
			ru: `FAQ`,
			ua: `FAQ`,
			en: `FAQ`
		},
		availability: false
	},
];

export const ACCOUNT_LINK_LIST: Array<string> = [
	'login/',
	'sign-up/',
	'account/',
];

export const LOGOUT_NAME: ILocalizationText = {
	ru: "Выйти",
	ua: "Bийти",
	en: "Sing out",
};
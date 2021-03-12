import IRouteConfig from '@app/interfaces/route-config';
import ILocalizationText from '@app/interfaces/localization-text';

export const ROUTER_CONFIG: IRouteConfig[] = [
  {
    url: '/',
    name: {
      ru: `Главная`,
      ua: `Головна`,
      en: `Home`
    },
    availability: false,
    mainMenu: true,
  },
  {
    url: 'faq/',
    name: {
      ru: `FAQ`,
      ua: `FAQ`,
      en: `FAQ`
    },
    availability: false,
    mainMenu: true,
  },
  {
    url: 'create-travel/',
    name: {
      ru: `Создать путешествие`,
      ua: `Створити подорож`,
      en: `Create travel`
    },
    availability: false,
    mainMenu: false,
  },
  {
    url: 'login/',
    name: {
      ru: `Авторизация`,
      ua: `Увійти`,
      en: `Log In`
    },
    availability: true,
    mainMenu: false,
  },
  {
    url: 'sign-up/',
    name: {
      ru: `Зарегистрироваться`,
      ua: `Зареєструватися`,
      en: `Sing up`
    },
    availability: true,
    mainMenu: false,
  },
  {
    url: 'account/',
    name: {
      ru: `Аккаунт`,
      ua: `Кабінет`,
      en: `Account`
    },
    availability: false,
    mainMenu: false,
  },
];

export const ACCOUNT_LINK_LIST: string[] = [
  'login/',
  'sign-up/',
  'account/',
];

export const LOGOUT_NAME: ILocalizationText = {
  ru: 'Выйти',
  ua: 'Bийти',
  en: 'Sing out',
};

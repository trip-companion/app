import { IRouteConfig, IRouteWithId } from '@app/interfaces/route-config';
import ILocalizationText from '@app/interfaces/localization-text';

export const ROUTER_CONFIG: IRouteConfig[] = [
  {
    url: '/',
    name: {
      ru: `Главная`,
      ua: `Головна`,
      en: `Home`
    },
    mainMenu: true,
  },
  {
    url: 'faq/',
    name: {
      ru: `FAQ`,
      ua: `FAQ`,
      en: `FAQ`
    },
    mainMenu: true,
  },
  {
    url: 'create-trip/',
    name: {
      ru: `Создать путешествие`,
      ua: `Створити подорож`,
      en: `Create trip`
    },
    mainMenu: false,
  },
  ///auth block start
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
    coreUrl: '/account/',
    availability: false,
    mainMenu: false,
    linkWithAvatar: true,
    childConfig:  [
      {
        url: 'account/trip-list/',
        name: {
          ru: `Мои объявления`,
          ua: `Мої оголошення`,
          en: `My posts`
        },
        pagination: true
      },
      {
        url: 'account/trip-feedback/',
        name: {
          ru: `Мои объявления`,
          ua: `Мої оголошення`,
          en: `My posts`
        },
        pagination: false
      },
    ]
  },
  ///auth block end
];

export const ROUTS_WITH_ID: IRouteWithId[] = [
  {
    url: 'edit-trip/',
    name: {
      ru: `Отредактировать путешествие`,
      ua: `Відредагувати подорож`,
      en: `Edit trip`
    },
    hasMainRout: false,
  },
  {
    url: 'view-trip/',
    name: {
      ru: `Детали путетествия`,
      ua: `Деталі подорожі`,
      en: `Detail of trip`
    },
    hasMainRout: false,
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

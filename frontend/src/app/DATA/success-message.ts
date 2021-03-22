import IGlobalEventMessage from '@app/interfaces/global-message-validator';

export const GLOBAL_SUCCESS_MESSAGE: IGlobalEventMessage[] = [
  {
    url: 'sign-up/',
    en: [
      'Registration successful, please login.'
    ],
    ru: [
      'Регистрация успешна, залогиньтесь.',
    ],
    ua: [
      'Реєстрація успішна, залогіньтесь.',
    ]
  },
  {
    url: 'account/',
    en: [
      'Avatar successfully uploaded',
      'Data successfully edited',
    ],
    ru: [
      'Аватар успешно загружен',
      'Данные успешно отредактированы',
    ],
    ua: [
      'Аватар успішно завантажено',
      'Дані успішно відредаговані',
    ]
  },
];

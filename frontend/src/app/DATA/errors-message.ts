import IGlobalEventMessage from '@app/interfaces/global-message-validator';

export const GLOBAL_ERROR_MESSAGE: IGlobalEventMessage[] = [
  {
    url: 'sign-up/',
    en: [
      'Incorrect format of email',
      'Passwords do not match',
      `Password must have at least one special character: !'#$%&'()*+,-./:;<=>?@[\]^_` + '`{|}~',
      'The password must have at least one lowercase letter',
      'Password must be at least one uppercase letter',
      'Password must be at least one number',
      'There must be no spaces in the password',
      'Minimum password length 8, maximum 16 characters',
      'Only Latin letters are allowed',
    ],
    ru: [
      'Неверный формат почты',
      'Пароли не совпадают',
      `Пароль должен иметь хотя бы один спецсимвол: !'#$%&'()*+,-./:;<=>?@[\]^_` + '`{|}~',
      'Пароль должен иметь минимум одну маленькую букву',
      'Пароль должен иметь минимум одну букву',
      'Пароль должен иметь минимум одно число',
      'В пароли не должно быть пробелов',
      'Минимальная длина пароля 8, максимальная 16 символов',
      'Разрешаются только латинcкие буквы',
    ],
    ua: [
      'Некорректний формат пошти',
      'Паролі не співпадають',
      `Пароль повинен мати хоча б один спецсимвол: !'#$%&'()*+,-./:;<=>?@[\]^_` + '`{|}~',
      'Пароль повинен мати мінімум одну маленьку літеру',
      'Пароль повинен мати мінімум одну велику літеру',
      'Пароль повинен мати мінімум одне число',
      'В паролі не повинно бути пробілів',
      'Мінімальна довжина паролю 8, максимальна 16 символів',
      'Дозволяються тільки латиньськи літери'
    ]
  },
  {
    url: 'account/',
    en: [
      'Incorrect format of email',
      'Passwords do not match',
      `Password must have at least one special character: !'#$%&'()*+,-./:;<=>?@[\]^_` + '`{|}~',
      'The password must have at least one lowercase letter',
      'Password must be at least one uppercase letter',
      'Password must be at least one number',
      'There must be no spaces in the password',
      'Minimum password length 8, maximum 16 characters',
      'Only Latin letters are allowed',
      //file upload
      'At least you can upload a 750*750 photo size.',
      'Error when load image, try other file or format of image.',
      'Error when load avetar, incorrect format! You can load only image!'
    ],
    ru: [
      'Неверный формат почты',
      'Пароли не совпадают',
      `Пароль должен иметь хотя бы один спецсимвол: !'#$%&'()*+,-./:;<=>?@[\]^_` + '`{|}~',
      'Пароль должен иметь минимум одну маленькую букву',
      'Пароль должен иметь минимум одну букву',
      'Пароль должен иметь минимум одно число',
      'В пароли не должно быть пробелов',
      'Минимальная длина пароля 8, максимальная 16 символов',
      'Разрешаются только латинcкие буквы',
      //file upload
      'Максимальное раcрешение для фотографии 750*750.',
      'Ошибка при загрузке изображения, попробуйте другой файл или формат.',
      'Ошибка при загрузке авaтара, неверный формат файла! Вы можете загрузить только изображение!'
    ],
    ua: [
      'Некорректний формат пошти',
      'Паролі не співпадають',
      `Пароль повинен мати хоча б один спецсимвол: !'#$%&'()*+,-./:;<=>?@[\]^_` + '`{|}~',
      'Пароль повинен мати мінімум одну маленьку літеру',
      'Пароль повинен мати мінімум одну велику літеру',
      'Пароль повинен мати мінімум одне число',
      'В паролі не повинно бути пробілів',
      'Мінімальна довжина паролю 8, максимальна 16 символів',
      'Дозволяються тільки латиньськи літери',
      //file upload
      'Максимальне розширення для фотографії складає 750 * 750.',
      'Помилка при завантаженні зображення, спробуйте інший файл або формат.',
      'Помилка при завантаженні аватара, невірний формат файлу! Ви можете завантажити тільки зображення!'
    ]
  },
  {
    url: 'create-trip/',
    en: [
      'Incorrect format of email',
    ],
    ru: [
      'Неверный формат почты',
    ],
    ua: [
      'Некорректний формат пошти',
    ]
  },
];

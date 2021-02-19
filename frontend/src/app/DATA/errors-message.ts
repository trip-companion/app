import IErrorMessage from '@app/interfaces/errors-message';

export const FORM_VALIDATORS: IErrorMessage[] = [
  {
    url: 'sign-up/',
    en: [
      'Incorrect format of email',
      'Passwords do not match',
    ],
    ru: [
      'Неверный формат почты',
      'Пароли не совпадают',
    ],
    ua: [
      'Некорректний формат пошти',
      'Паролі не співпадають',
    ]
  },
  {
    url: 'account/',
    en: [
      'Incorrect format of email',
      'Passwords do not match',
      //file upload
      'At least you can upload a 750*750 photo size.',
      'Error when load image, try other file or format of image.',
      'Error when load avetar, incorrect format! You can load only image!'
    ],
    ru: [
      'Неверный формат почты',
      'Пароли не совпадают',
      //file upload
      'Максимальное раcрешение для фотографии 750*750.',
      'Ошибка при загрузке изображения, попробуйте другой файл или формат.',
      'Ошибка при загрузке авaтара, неверный формат файла! Вы можете загрузить только изображение!'
    ],
    ua: [
      'Некорректний формат пошти',
      'Паролі не співпадають',
      //file upload
      'Максимальне розширення для фотографії складає 750 * 750.',
      'Помилка при завантаженні зображення, спробуйте інший файл або формат.',
      'Помилка при завантаженні аватара, невірний формат файлу! Ви можете завантажити тільки зображення!'
    ]
  },
];

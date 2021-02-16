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
];

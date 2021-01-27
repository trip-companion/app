export interface PortfolioData {
    id: number;
    category: string;
    title: string;
    description: string;
    popupTitle: string;
    popupTitleText: string;
    popupDescription: string;
    popupTitleList: string;
    popupTitleListImet1: string;
    popupTitleListImet2?: string;
    popupTitleListImet3?: string;
    popupInterestingTitle: string;
    popupInterestingItem1:  string;
    popupInterestingItem2?: string;
    popupInterestingItem3?:  string;
    popupDescriptionContent: string;
    popupVideo:  string;
    videosrc: string;
    mobposter:string;
    imgTitle:string;
    imgAlt:string;
}

export interface PortfolioEntity {
    ru?: PortfolioData[];
    uk?: PortfolioData[];
    en?: PortfolioData[];
}

export class PortfolioCategoriesLangs {
    ru: { viewValue };
    uk: { viewValue };
    en: { viewValue };
};

export class PortfolioCategories {
    value: string;
    langs: PortfolioCategoriesLangs;
};

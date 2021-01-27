
import ILocalizationText from './localization-text';

export interface ILocalizationArrays {
	ru: Array<string | number>;
	uk: Array<string  |  number>;
	en: Array<string|  number>;
};

export default interface IPriceItems {
	id: number;
    url: string;
    img_card: string;
    img_top:string;
    category: string;
    price_content: string;
    packeges_info: {
        base:ILocalizationArrays,
        middle:ILocalizationArrays, 
        full: ILocalizationArrays
    },
    price: ILocalizationArrays;
    tarif_name: {[key: string]:Object};
    tarif_helper_name?: {[key: string]:Object};
    title: ILocalizationText;
    content:ILocalizationText;
    contentExtended?:ILocalizationText;
    video_link?:string;
    photo_link?: Array<string>;
    audio_link?: Array<{name: string,  link: string}>;
    faq?:Object;
};




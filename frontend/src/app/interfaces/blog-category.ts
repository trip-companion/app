
import ILocalizationText from './localization-text';
import { Data } from '@angular/router';

export default interface IBlogCategory {
	id: number;
    url: string;
    img: string;
    img_bg:string;
    category: ILocalizationText;
    date: string;
	title: ILocalizationText;
    contentPrev: ILocalizationText;
    content:ILocalizationText;
    anchor_menu?: Object;
};

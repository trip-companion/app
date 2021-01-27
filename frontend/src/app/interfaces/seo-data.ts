import ILocalizationText from './localization-text';

export interface ISeoSubpageData {
	page: string;
	title: string;
	description: string;
	social_title: string;
}

export interface ISeoPageData {
	page: string;
	canonical_url: string;
	title: string;
	description: string;
	social_title: string;
	subpage: boolean;
	subpageData: ISeoSubpageData[];
}

// export interface ISeoData {
//     ru?: ISeoPageData[];
//     uk?: ISeoPageData[];
//     en?: ISeoPageData[];
// }

export interface ISeoData {
	page: string;
	title: ILocalizationText;
	description: ILocalizationText;
}

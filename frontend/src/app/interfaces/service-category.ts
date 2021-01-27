/**
 * @author [Aleksandr Kinash]
 * @email [aleksandrkinash90@gmail.com]
 * @create date 2019-04-04 18:01:06
 * @modify date 2019-04-04 18:01:06
 * @desc [description]
 */
import ILocalizationText from './localization-text';

export default interface IServiceCategory {
	id: number;
	url: string;
	title: ILocalizationText;
	content: ILocalizationText;
	contentExtended:ILocalizationText
}

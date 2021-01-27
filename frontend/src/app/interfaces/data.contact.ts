/**
 * @author [Aleksandr Kinash]
 * @email [aleksandrkinash90@gmail.com]
 * @create date 2019-04-15 15:01:07
 * @modify date 2019-04-15 15:01:07
 * @desc [description]
 */
import ILocalizationText from "./localization-text";

export default interface IContactData {
    city: ILocalizationText;
    address: ILocalizationText;
    title: ILocalizationText;
    gMapHref: string;
    phones: {href: string, phone: string, text: string}[];
    mails: {href: string, text: string}[];
    namePhoneManager:ILocalizationText;
    namePhoneHead:ILocalizationText;
    namePhoneRentManager:ILocalizationText;
};

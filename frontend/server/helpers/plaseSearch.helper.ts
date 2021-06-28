import { join } from 'path';
const distFolder = join(process.cwd(), 'dist/browser');
import { CityModel, ICity } from '../db/models/city.model';
import { yandexTranslateHelper, yandexTranslateAutoHelper } from './translate.helper';
const request = require('request');
const photonUri = 'https://photon.komoot.io/api/?q=';
const fs = require('fs');

export const splitArr = (arr, chunks): Array<any[]> => {
	return arr.reduce((acc, n, i) => ((acc[i % chunks] = acc[i % chunks] || []).push(n), acc), []);
};
  
export const writeFileToJson = (arr: ICity[], name: string, index: number): void => {
	try {
		const myJson = JSON.stringify(arr);
		fs.writeFile(distFolder + `/${name}_OK${index}.json`, myJson, (err) => {
			if (err) throw err;
			console.log('Data written to file');
		});
	} catch(error) {
		console.log('error when parse object to json = ', error)
	};
};

export const createCityModelAfterOk = async (arr: ICity[]): Promise<ICity[]> => {
	const newArr: ICity[] = [];
	for(const cityItem of arr) {
		if(/^[^а-яёіїєґ]+$/i.test(cityItem.fields.cityNames.ru) || /^[^а-яёіїєґ]+$/i.test(cityItem.fields.cityNames.ua)
			||  cityItem.fields.cityNames.ru.includes("...") || cityItem.fields.cityNames.ua.includes("...")) {
			console.log("original city in json: ", cityItem);
			const langRu = await yandexTranslateHelper('en', 'ru', cityItem.fields.cityNames.en);
			const langUa = await yandexTranslateHelper('en', 'uk', cityItem.fields.cityNames.en);
			const city = await saveCityInDb(cityItem, langRu, langUa);
			console.log('city after insert db(if) is:  ', city);
			newArr.push(city);
		} else {
			const city = await saveCityInDb(cityItem, cityItem.fields.cityNames.ru, cityItem.fields.cityNames.ua);
			console.log('city after insert db(else) is:  ', city);
			newArr.push(city);
		};
	};
	console.log("===FINISH createCityModelAfterOk cycle===")
	return newArr;
};

export const createCityModel = async (arr: any) => {
	const newArr: ICity[] = [];
	for(const cityItem of arr) {
	  const langRu = await yandexTranslateHelper('en', 'ru', cityItem.fields.city);
	  const langUa = await yandexTranslateHelper('en', 'uk', cityItem.fields.city);
  
	  const city = await saveCityInDb(cityItem, langRu, langUa);
		newArr.push(city);
	}
	console.log("===FINISH createCityModel cycle===")
	return newArr;
};

export const findAllAndUpdateName = async (): Promise<void> => {
	const cities: any = await CityModel.find();
	const splitedFile = splitArr(cities, 40);

	await Promise.all(splitedFile.map( async cities => {
		
		for(const city of cities) {
			if(/^[^а-яёіїєґ]+$/i.test(city.fields.cityNames.ru) || /^[^а-яёіїєґ]+$/i.test(city.fields.cityNames.ua)) {
				const langRu = await yandexTranslateAutoHelper('ru', city.fields.cityNames.ru);
				const langUa = await yandexTranslateAutoHelper('uk', city.fields.cityNames.ua);
	
				await CityModel.findOneAndUpdate(
					{recordid: city.recordid},
					{ $set:
						{
							'fields.cityNames.ua': langUa,
							'fields.cityNames.ru': langRu
						},
					}, {new: true}, (err, updatedCity) => {
					if (err) {
						console.log("Something wrong when updating data!");
					}
					console.log("city upd: ", updatedCity);
				});
			};
		};
	}));

	console.log("=========FINISH findAllAndUpdateName======")
};

export const findCitiesByCodeAndSave = async (listOfCountry: string[]): Promise<void> => {
	// const cities: ICity[] = await CityModel.find({
	// 	'fields.country': { "$in": listOfCountry} 
	// }).exec();
	const cities: ICity[] =  await CityModel.find({})
	writeFileToJson(cities, `${listOfCountry[0]}-${listOfCountry[listOfCountry.length]}`, 1);
	console.log('ok')
};

export const photonReq = (searchPlace: string): Promise<string> => {
	const photoUriWithValue = encodeURI(photonUri + searchPlace); 
  return new Promise((resolve, reject) => {
    request.get(photoUriWithValue, { json: true }, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
};

const saveCityInDb = async (cityItem: ICity, ru: string, ua: string): Promise<ICity> => {
	const savedCity = await new CityModel({
		recordid: cityItem.recordid,
		fields: {
		  cityNames: {
			en: cityItem.fields.cityNames.en,
			ru: ru,
			ua: ua,
		  },
		  country: cityItem.fields.country,
		  region: cityItem.fields.region,
		  longitude: cityItem.fields.longitude,
		  latitude: cityItem.fields.latitude,
		  accentcity: cityItem.fields.accentcity,
		}
	})
	.save()
	.catch(error => {
		console.log({message: `Error happened on server when save new City: ${error}`});
		return cityItem;
	});

	return savedCity;
};
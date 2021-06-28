const request = require('request');

export const yandexTranslateHelper = (langFrom: string, langTo: string, value: string): Promise<string> => {
	const uri = encodeURI(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YANDEX_TOKEN18}&lang=${langTo}&text=${value}`);
	const uriAuto = encodeURI(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YANDEX_TOKEN11}&lang=${langTo}&text=${value}`);
	
	return new Promise((resolve, reject) => {
		request.get(uri, { json: true }, (error, res, body) => {
			if (!error && res.statusCode == 200) {
				console.log('request body is: ', body);
				resolve(body.text[0]);
			} else {
				request.get(uriAuto, { json: true }, (error, res, body) => {
					if (!error && res.statusCode == 200) {
						console.log('after second req: ', body)
						console.log('and req is:  ', uri);
						resolve(body.text[0]);
					} else {
						console.log("error body: ",  body)
						resolve(value);
					}
				});
			}
		});
	});
};

export const yandexTranslateAutoHelper = (langTo: string, value: string): Promise<string> | string => {
	const uriAuto = encodeURI(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YANDEX_TOKEN11}&lang=${langTo}&text=${value}`);
	
	return new Promise((resolve, reject) => {
		request.get(uriAuto, { json: true }, (error, res, body) => {
			if (!error && res.statusCode == 200) {
				console.log('request body is: ', body);
				resolve(body.text[0]);
			} else {
				console.log("error body: ",  body)
				resolve(value);
			}
		});
	});

};
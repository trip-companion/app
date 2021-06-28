import { join } from 'path';
const distFolder = join(process.cwd(), 'dist/browser');
const fs = require('fs');

import { photonReq, splitArr, writeFileToJson, createCityModelAfterOk, createCityModel, findAllAndUpdateName, findCitiesByCodeAndSave } from '../helpers/plaseSearch.helper';

const findPlace = async (req, res) => {
	console.log("REQ IS:", req.body);
	try {
		const answer = await photonReq(req.body.value);
		res.status(200).json(answer);
	} catch(error) {
		console.log(error)
		res.status(401).json(error)
	}
};

const parseFile = async (req, res, next) => {
  const readFileFromDir = fs.readFileSync(distFolder + `/assets/json/${req.body.fileName}.json`);
  const parsedCityData = JSON.parse(readFileFromDir);
  
  const splitedFile = splitArr(parsedCityData, 30);
  const editArray = [].concat(await Promise.all(splitedFile.map( async arr => {
    return await createCityModel(arr);
  })));

  editArray.forEach((arr, index) => {
    writeFileToJson(arr, req.body.fileName, index);
  });

  res.status(200).json({message: 'ok'});
};

const parseOkFile = async (req, res, next) => {
  const readFileFromDir = fs.readFileSync(distFolder + `/assets/json/${req.body.fileName}.json`);
  const parsedCityData = JSON.parse(readFileFromDir);

  const splitedFile = splitArr(parsedCityData, 30);
  const editArray = [].concat(await Promise.all(splitedFile.map( async arr => {
    return await createCityModelAfterOk(arr);
  })));

  editArray.forEach((arr, index) => {
    writeFileToJson(arr, req.body.fileName, index);
  });

  res.status(200).json({message: 'ok'});
};

const updateCityNameInDb = async (req, res, next) => {
  await findAllAndUpdateName();

  res.status(200).json({message: 'ok'});
};

const saveCityFromBdByArr = async (req, res, next) => {
  await findCitiesByCodeAndSave(req.body.cities);

  res.status(200).json({message: 'ok'});
};

const checkJsonLength =  (req, res, next) => {
  const readFileFromDir = fs.readFileSync(distFolder + `/assets/json/${req.body.fileName}.json`);
  const parsedCityData = JSON.parse(readFileFromDir);

  const readFileFromDir2 = fs.readFileSync(distFolder + `/assets/json/${req.body.fileName}_OK.json`);
  const parsedCityData2 = JSON.parse(readFileFromDir2);

  for(const city of parsedCityData) {
    const findArr = parsedCityData2.find(({recordid: recId}) => {
      return city.recordid === recId;
    })
    if(!findArr) console.log("city not find is:", city);
  };
  
  res.status(200).json({message: `length: ${parsedCityData.length} file name: ${req.body.fileName}`});
};

export {
  findPlace,
  parseFile,
  parseOkFile,
  updateCityNameInDb,
  saveCityFromBdByArr,
  checkJsonLength,
};

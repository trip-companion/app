import { Router } from 'express';
const router = Router();

import { findPlace, parseOkFile, parseFile, updateCityNameInDb, saveCityFromBdByArr, checkJsonLength} from '../controllers/placeSearch'

router.post('/', findPlace);
router.post('/parse', parseFile);
router.post('/parse-after-ok', parseOkFile);
router.post('/save-from-db', saveCityFromBdByArr);
router.post('/check-json-length', checkJsonLength);
router.put('/update-cityName-db', updateCityNameInDb);

export default router;
import { Router } from 'express';
import costsController from '../controllers/costsController';
import devicesController from '../controllers/devicesController';
import sitesController from '../controllers/sitesController';

const router = Router();

router.get('/devices', devicesController.getDevices);
router.get('/sites', sitesController.getSites);
router.post('/sites', sitesController.createSite);
router.put('/sites/:id', sitesController.updateSite);
router.get('/costs', costsController.getCosts);


export default router;

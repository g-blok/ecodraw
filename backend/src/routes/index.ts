import { Router } from 'express';
import costsController from '../controllers/costsController';
import devicesController from '../controllers/devicesController';
import sitesController from '../controllers/sitesController';

const router = Router();

router.get('/devices', devicesController.getDevices);
router.get('/sites', sitesController.getSites);
router.put('/sites/:id', sitesController.updateSiteLayout);
router.get('/costs', costsController.getCosts);


export default router;

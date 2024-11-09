import { Router } from 'express';
import {
    createADP,
    getADP,
    getADPs,
    updateADP,
    deleteADP,
    verifyADP,
} from "../controllers/ADP.controller.js";

const router = Router(); 

import {verifyAEP as ADPchain} from '../middlewares/scanning.middleware.js';

router.route('/').post(createADP).get(getADPs);
router.route('/getADP/:id').get(getADP).put(updateADP).delete(deleteADP);
router.route('/verify/:id').get(verifyADP);

export default router;
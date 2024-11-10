import { Router } from 'express';
import {
    createADP,
    getADPbyId,
    getADPs,
    updateADP,
    deleteADP,
    verifyADP,
} from "../controllers/ADP.controller.js";

const router = Router(); 

import {verifyAEP as ADPchain} from '../middlewares/scanning.middleware.js';

router.route('/').post(createADP).get(getADPs);
router.route('/:id').get(getADPbyId).patch(updateADP).delete(deleteADP);
router.route('/verify/:id').get(verifyADP);

export default router;
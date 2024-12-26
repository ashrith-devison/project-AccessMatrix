import { Router } from 'express';
import {
    createADP,
    getADPbyId,
    getADPs,
    updateADP,
    deleteADP,
    verifyADP,
    renewADP,
    blockADP,
    unblockADP
} from "../controllers/ADP.controller.js";

const router = Router(); 

import {verifyAEP as ADPchain} from '../middlewares/scanning.middleware.js';

router.route('/').post(createADP).get(getADPs);
router.route('/:id').get(getADPbyId).patch(updateADP).delete(deleteADP);
router.route('/verify/:id').get(verifyADP);
router.route('/renew/:id').post(renewADP);
router.route('/block/:id').get(blockADP);
router.route('/unblock/:id').get(unblockADP);

export default router;
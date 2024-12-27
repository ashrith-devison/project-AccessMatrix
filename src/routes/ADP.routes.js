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
import {adminMiddleware, securityMiddleware} from '../middlewares/admin.middleware.js';
router.route('/').post(adminMiddleware,createADP).get(getADPs);
router.route('/:id').get(securityMiddleware,getADPbyId).patch(adminMiddleware,updateADP).delete(adminMiddleware,deleteADP);
router.route('/verify/:id').get(securityMiddleware,verifyADP);
router.route('/renew/:id').post(adminMiddleware,renewADP);
router.route('/block/:id').get(adminMiddleware,blockADP);
router.route('/unblock/:id').get(adminMiddleware,unblockADP);

export default router;
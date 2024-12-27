import {Router} from 'express';
import {
    createAEP,
    getAEP,
    getAEPs,
    updateAEP,
    deleteAEP,
    fetchAdpByAEP,
    renewAEP,
    blockAEP,
    unblockAEP
} from '../controllers/AEP.controller.js';


const router = Router();
import {adminMiddleware, securityMiddleware} from '../middlewares/admin.middleware.js';

router.route('/').post(adminMiddleware,createAEP).get(getAEPs);
router.route('/:id').get(securityMiddleware,getAEP).patch(updateAEP).delete(deleteAEP);
router.route('/getADPs/:id').get(adminMiddleware,fetchAdpByAEP);
router.route('/renew/:id').post(adminMiddleware,renewAEP);
router.route('/block/:id').get(adminMiddleware,blockAEP);
router.route('/unblock/:id').get(adminMiddleware,unblockAEP);

export default router;
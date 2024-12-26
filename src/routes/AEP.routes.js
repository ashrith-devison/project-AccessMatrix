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

router.route('/').post(createAEP).get(getAEPs);
router.route('/:id').get(getAEP).patch(updateAEP).delete(deleteAEP);
router.route('/getADPs/:id').get(fetchAdpByAEP);
router.route('/renew/:id').post(renewAEP);
router.route('/block/:id').get(blockAEP);
router.route('/unblock/:id').get(unblockAEP);

export default router;
import {Router} from 'express';
import {
    createAEP,
    getAEP,
    getAEPs,
    updateAEP,
    deleteAEP,
    fetchAdpByAEP
} from '../controllers/AEP.controller.js';


const router = Router();

router.route('/').post(createAEP).get(getAEPs);
router.route('/:id').get(getAEP).patch(updateAEP).delete(deleteAEP);
router.route('/adp/:id').get(fetchAdpByAEP);

export default router;
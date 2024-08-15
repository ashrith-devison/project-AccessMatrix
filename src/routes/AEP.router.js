import {Router} from 'express';
import {
    createAEP,
    getAEP,
    getAEPs,
    updateAEP,
    deleteAEP
} from '../controllers/AEP.controller.js';


const router = Router();

router.route('/').post(createAEP).get(getAEPs);
router.route('/:id').get(getAEP).put(updateAEP).delete(deleteAEP);

export default router;
import {Router} from "express";
import {
    createAVP,
    getAVP,
    getAVPs,
    updateAVP,
    verifyAVP,
    renewAVP
} from "../controllers/AVP.controller.js";

const router = Router();

router.route('/:id').get(getAVP).patch(updateAVP);
router.route('/create').post(createAVP);
router.route('/').get(getAVPs);
router.route('/verify/:id').get(verifyAVP);
router.route('/renew/:id').patch(renewAVP);

export default router;
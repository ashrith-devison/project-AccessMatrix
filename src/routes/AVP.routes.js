import {Router} from "express";
import {
    createAVP,
    getAVP,
    getAVPs,
    updateAVP,
    verifyAVP
} from "../controllers/AVP.controller.js";

const router = Router();

router.route('/:id').get(getAVP).patch(updateAVP);
router.route('/create').post(createAVP);
router.route('/').get(getAVPs);
router.route('/verify/:id').get(verifyAVP);

export default router;
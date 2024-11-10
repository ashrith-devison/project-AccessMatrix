import {Router} from "express";
import {
    createAVP,
    getAVP,
    getAVPs,
    verifyAVP
} from "../controllers/AVP.controller.js";

const router = Router();

router.route('/:id').get(getAVP);
router.route('/create').post(createAVP);
router.route('/').get(getAVPs);
router.route('/verify/:id').get(verifyAVP);

export default router;
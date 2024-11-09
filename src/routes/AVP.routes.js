import {Router} from "express";
import {
    createAVP,
    getAVP,
    verifyAVP
} from "../controllers/AVP.controller.js";

const router = Router();

router.route('/:id').get(getAVP);
router.route('/create').post(createAVP);

export default router;
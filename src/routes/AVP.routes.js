import {Router} from "express";
import {
    createAVP,
    getAVPs,
    verifyAVP
} from "../controllers/AVP.controller.js";

const router = Router();

router.route('/').get(getAVPs);

export default router;
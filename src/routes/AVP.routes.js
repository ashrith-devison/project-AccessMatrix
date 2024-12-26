import {Router} from "express";
import {
    createAVP,
    getAVP,
    getAVPs,
    updateAVP,
    verifyAVP,
    renewAVP,
    getAVPById,
    blockAVP,
    unblockAVP
} from "../controllers/AVP.controller.js";

const router = Router();

router.route('/:id').get(getAVP).patch(updateAVP);
router.route('/id/:id').get(getAVPById);
router.route('/create').post(createAVP);
router.route('/').get(getAVPs);
router.route('/verify/:id').get(verifyAVP);
router.route('/renew/:id').post(renewAVP);
router.route('/block/:id').get(blockAVP);
router.route('/unblock/:id').get(unblockAVP);

export default router;
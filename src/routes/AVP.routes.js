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
import {adminMiddleware, securityMiddleware} from '../middlewares/admin.middleware.js';

router.route('/:id').get(securityMiddleware,getAVP).patch(updateAVP);
router.route('/id/:id').get(getAVPById);
router.route('/create').post(adminMiddleware,createAVP);
router.route('/').get(getAVPs);
router.route('/verify/:id').get(securityMiddleware,verifyAVP);
router.route('/renew/:id').post(adminMiddleware,renewAVP);
router.route('/block/:id').get(adminMiddleware,blockAVP);
router.route('/unblock/:id').get(adminMiddleware,unblockAVP);

export default router;
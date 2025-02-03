import {Router} from 'express';
import { qrverify, oneqr } from '../controllers/qr.controller.js';
import { securityMiddleware } from '../middlewares/admin.middleware.js';
const router = Router();

router.route("/:id").get(qrverify);
// router.route("/").post(qrCreate);
router.route("/oneqr/:option?").post(securityMiddleware,oneqr);

export default router;
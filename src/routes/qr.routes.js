import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { qrverify, oneqr } from '../controllers/qr.controller.js';

const router = Router();

router.route("/:id").get(qrverify);
// router.route("/").post(qrCreate);
router.route("/oneqr").post(oneqr);

export default router;
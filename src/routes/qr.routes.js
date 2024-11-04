import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { qrverify,qrCreate } from '../controllers/qr.controller.js';

const router = Router();

router.route("/:id").get(verifyJWT,qrverify);
router.route("/").post(qrCreate);

export default router;
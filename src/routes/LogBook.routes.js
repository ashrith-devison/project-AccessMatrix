import {Router} from 'express';
import {createEntry, updateExitEntry} from '../controllers/LogBook.controller.js';

const router = Router(); 

router.route("/").post(createEntry);
router.route("/exit").post(updateExitEntry);

export default router;
import {Router} from 'express';
import {createEntry, updateExitEntry,getLogBookById,getAllLogBooks} from '../controllers/LogBook.controller.js';

const router = Router(); 

router.route("/").post(createEntry);
router.route("/exit").post(updateExitEntry);
router.route("/:IdType/:Id").get(getLogBookById);
router.route("/").get(getAllLogBooks);

export default router;
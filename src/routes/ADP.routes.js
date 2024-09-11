import {Route} from "express"
import {
    createADP,
    getADP,
    getADPs,
    updateADP,
    deleteADP
} from "../controllers/ADP.controller.js"

const router = Route()

router.route('/').post(createADP).get(getADPs)
router.route('/:id').get(getADP).put(updateADP).delete(deleteADP)

export default router
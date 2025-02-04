import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {
    registerSecurityEmployee as registerEmployee,
    loginUser,
    logoutUser,
    changePassword,
    forgotPassword,
    getAllEmployeeDetails
} from '../controllers/User.controller.js';

const router = Router();
import {adminMiddleware, securityMiddleware} from '../middlewares/admin.middleware.js';

router.route('/register').post(adminMiddleware,registerEmployee);
router.route('/login').post(loginUser);
router.route('/logout').get(verifyJWT,logoutUser);
router.route('/change-password').patch(verifyJWT,changePassword);
router.route('/forgot-password').post(forgotPassword); // need to check this facility
router.route('/employees/all').get(adminMiddleware,getAllEmployeeDetails);
export default router;
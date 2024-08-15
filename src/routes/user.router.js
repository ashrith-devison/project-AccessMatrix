import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {
    registerEmployee,
    loginUser,
    logoutUser,
    changePassword,
    forgotPassword
} from '../controllers/User.controller.js';

const router = Router();

router.route('/register').post(registerEmployee);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/change-password').post(verifyJWT,changePassword);
router.route('/forgot-password').post(forgotPassword); // need to check this facility
export default router;
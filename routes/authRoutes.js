const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router(); 

router.get('/home',authController.home)
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post)
router.get('/logout',authController.logout_get)
router.post('/resetPassword',authController.resetPassword_post)
router.get('/resetPassword',authController.resetPassword_get)
router.get('/reset',authController.reset_get)

  module.exports = router;

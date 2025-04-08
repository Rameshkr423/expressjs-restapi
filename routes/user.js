const express = require('express');
const router  = express.Router();
const userController = require('../controllers/user');

router.get('/user', userController.getAllUser);
router.delete('/user', userController.deleteAllUser);
router.post("/user", userController.uploadImg, userController.newUser);
//router.post("/user", upload.none(), teaController.newTea);
router.get('/user/:user', userController.getOneUser);
router.post('/user/:name', userController.newComment);
router.delete('/user/:name', userController.deleteOneUser);
router.post("/user", userController.newUser);
      
module.exports = router;
       

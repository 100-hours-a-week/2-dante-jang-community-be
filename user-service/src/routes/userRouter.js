const express = require("express");
const multer = require('multer');
const userController = require("../controllers/userController");

const router = express.Router();
const upload = multer();

router.post("", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/check-password", userController.checkPassword);

router.get("", userController.userInfo);
router.get("/check-email", userController.emailDuplicatedCheck);
router.get("/check-name", userController.nameDuplicatedCheck);
router.get("/internal", userController.userInfoInternal);

router.patch("/change-profile", upload.single('profileImage'), userController.changeProfile);
router.patch("/change-name", userController.changeName);
router.patch("/change-password", userController.changePassword);

router.delete("", userController.deleteUser);

module.exports = router;
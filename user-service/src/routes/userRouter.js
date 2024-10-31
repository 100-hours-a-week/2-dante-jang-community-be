// routes/userRouter.js
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get("", userController.userInfo);
router.get("/check-email", userController.emailDuplicatedCheck);
router.get("/internal", userController.userInfoInternal);

router.patch("", userController.modifyUser);
router.patch("/change-password", userController.changePassword);

router.delete("", userController.deleteUser);

module.exports = router;
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateAccountDetails,
} from "../controllers/authControllers.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {verifyJWT} from "../middlewares/authMiddleware.js";


const router = express.Router();

// Register with avatar  upload
router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

// Login
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;

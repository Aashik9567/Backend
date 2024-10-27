import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetail,updateUserAvatar,updateUserCoverImage, getUserChannelProfile, getWatchHistory  } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router =Router()

router.route("/registers").post(
    upload.fields([
        {
            name:"avatar",
            maxCount :1
        },
        {
            name:"coverImage",
            maxCount :1
        }
    ]),
    registerUser)
router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/newtoken").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/current-user").post(verifyJwt,getCurrentUser)
router.route("/update-account-detail").patch(verifyJwt,updateAccountDetail)
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar)
router.route("/update-coverimage").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJwt,getUserChannelProfile)
router.route("/history").get(verifyJwt,getWatchHistory)
export default router
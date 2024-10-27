import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetail,updateUserAvatar,updateUserCoverImage  } from "../controllers/user.controller.js";
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
router.route("/update-account-detail").post(verifyJwt,updateAccountDetail)
router.route("/update-avatar").post(verifyJwt,updateUserAvatar)
router.route("/update-coverimage").post(verifyJwt,updateUserCoverImage)

export default router
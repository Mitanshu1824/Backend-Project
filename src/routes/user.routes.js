import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/Multer.Middleware.js";
import { verifyJwt } from "../middlewares/auth.Middleware.js";

const router  = Router();

router.route("/register").post(
    upload.fields ([
        {name : "avatar", maxCount : 1},
        {name : "coverImage" , maxCount : 1}
    ]),
    registerUser
)

router.post("/login", (req, res) => {
  res.json({ message: "Login route reached" });
});
 
// router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJwt, logoutUser)

export default router;
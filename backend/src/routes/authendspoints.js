import { login,signup,verifyOTPAndUpdatePassword,generateAndSendOTP,changepassword, getAllUsers,deleteUserById,updateUserById, findUserById, } from "../authentication/index.js";
import  express from "express";
import { verifyingtoken } from "../utils/jwtfunctions.js";
import checkActive from "../middleware/checkActive.js";

const authRouter = express.Router();
authRouter.post("/login",checkActive,login);
authRouter.post("/signup",signup);
authRouter.post("/reset", verifyOTPAndUpdatePassword);
authRouter.post("/forget", generateAndSendOTP);
authRouter.use(verifyingtoken)
authRouter.get("/getAllUsers", getAllUsers);
authRouter.post("/change", changepassword);
authRouter.get("/getUserById/:id",findUserById)
authRouter.delete("/deleteUserById/:id", deleteUserById);
authRouter.patch("/updateUserById/:id", updateUserById);
export default authRouter;

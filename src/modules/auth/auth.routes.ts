import { Router } from "express";
import { authController } from "./auth.controllers";

const router = Router();

router.post("/signin", authController.loginUser);

router.post("/signup", authController.signUpUser);

export const authRoutes = router;

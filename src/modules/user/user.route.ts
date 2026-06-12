import { Router } from "express";
import { userController } from "./user.controller";

 const route = Router();

 route.post('/signup',userController.createUser)
 route.post('/login',userController.loginUser)



 export const userRoute = route;
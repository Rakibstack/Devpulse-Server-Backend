import { Router } from "express";
import { userController } from "./user.controller";

 const route = Router();

 route.post('/signup',userController.createUser)



 export const userRoute = route;
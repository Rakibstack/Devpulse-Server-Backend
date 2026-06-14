import type { Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utility/response";
import { sendErrorResponse } from "../../utility/errorResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, 201, "User Created Successfully", result);
  } catch (error: any) {
   sendErrorResponse(res,500,error.message,error)
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUserIntoDB(req.body);
   sendResponse(res,200,'User Login Successfully.',result)
  } catch (error: any) {
    sendErrorResponse(res,500,error.message,error)
  }
};

export const userController = {
  createUser,
  loginUser,
};

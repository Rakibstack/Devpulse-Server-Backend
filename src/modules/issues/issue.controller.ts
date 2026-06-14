import type { Request, Response } from "express";
import { issueServer } from "./issue.service";
import { sendResponse } from "../../utility/response";
import { sendErrorResponse } from "../../utility/errorResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueServer.createIssueIntoDB(req.body, req.user.id);
    sendResponse(res, 201, "Issue Created  Successfull", result);
  } catch (error: any) {
    sendErrorResponse(res, 500, error.messag, error);
  }
};

const getAllIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueServer.getAllIssueIntoDB();
    sendResponse(res, 200, "Issues retrived  Successfull", result);
  } catch (error: any) {
    sendErrorResponse(res, 500, error.message, error);
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueServer.getSingleIssueFromDB(id as string);
    // console.log(result);

    // if (result.rows.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Issue Not Found",
    //   });
    // }
    sendResponse(res, 200, "Issues retrived  Successfull", result);
  } catch (error: any) {
  sendErrorResponse(res,500,error.message,error)
  }
};

const updateSingleIssue = async (req: Request, res: Response) => {
  // const { id } = req.params;
  try {
    const result = await issueServer.updateSingleIssueFromDB(
      req.params.id as string,
      req.body,
      req.user,
    );
   sendResponse(res,200,"Issue Update Successfull",result)
  } catch (error: any) {
   sendErrorResponse(res,500,error.message,error)
  }
};

const deleteSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await issueServer.deleteSingleUserFromDB(
      req.params.id as string,
    );
   sendResponse(res,200,"Issue Delete Successfull",result)
  } catch (error: any) {
   sendErrorResponse(res,500,error.message,error)
  }
};

export const issuesController = {
  createIssue,
  getAllIssue,
  getSingleIssue,
  updateSingleIssue,
  deleteSingleUser,
};

import type { Request, Response } from "express";
import { issueServer } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueServer.createIssueIntoDB(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Issue Created  Successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueServer.getAllIssueIntoDB();
    res.status(200).json({
      success: true,
      message: "Issues retrived  Successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
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
    res.status(200).json({
      success: true,
      message: "Issue Retrived Successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
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
    res.status(200).json({
      success: true,
      message: "Issue Update Successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssue,
  getSingleIssue,
  updateSingleIssue,
};

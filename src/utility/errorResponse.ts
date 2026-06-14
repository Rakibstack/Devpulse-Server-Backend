import type { Response } from "express";



export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  error?: unknown
) => {

  return res.status(statusCode).json({

    success: false,

    message,

    error: error ?? null

  });

};
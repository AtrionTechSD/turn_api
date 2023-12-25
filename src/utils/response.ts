import { Response } from "express";

export default {
  success(res: Response, status: number, body: any): void {
    res.status(status).json({
      statusCode: status,
      content: body,
    });
  },

  error(res: Response, status: number, error: any): void {
    res.status(status).json({
      statusCode: status,
      content: error,
    });
  },
};

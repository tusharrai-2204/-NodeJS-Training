import type { Request, Response } from 'express';
import type { CreateIssueSchema, IssueQuerySchema } from '../schema/issue.schema.js';
import * as issueService from '../services/issue.service.js';
import { BadRequestError } from '../utils/AppError.js';

export const getIssues = async (_req: Request, res: Response) => {
  const query = res.locals.query as IssueQuerySchema;
  const result = await issueService.listIssues(query);
  res.status(200).json({ success: true, data: result.issues, meta: result.meta });
};

export const createIssue = async (req: Request, res: Response) => {
  const input = req.body as CreateIssueSchema;
  const issue = await issueService.issueBook(input);
  res.status(201).json({ success: true, data: issue });
};

export const returnBook = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) throw new BadRequestError('Invalid issue ID');

  const issue = await issueService.returnBook(id);
  res.status(200).json({ success: true, data: issue, message: 'Book returned successfully' });
};
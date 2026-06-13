import { Router } from "express";
import { issuesController } from "./issue.controller";
import authMiddleware from "../../middleware/auth";

const route = Router()

route.post('/',authMiddleware(),issuesController.createIssue)
route.get('/',issuesController.getAllIssue)


export const issuesRoute = route;
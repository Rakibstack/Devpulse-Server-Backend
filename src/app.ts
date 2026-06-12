import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors"
import { userRoute } from "./modules/user/user.route";
import { issuesRoute } from "./modules/issues/issue.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

 app.use(express.json());
 app.use(cors({origin: "localhost:3000"}))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

 app.use('/api/auth',userRoute)
 app.use('/api/issues',issuesRoute)


 app.use(globalErrorHandler)


export default app;

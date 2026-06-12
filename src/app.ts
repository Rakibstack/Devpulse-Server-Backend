import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors"
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

 app.use(express.json());
 app.use(cors({origin: "localhost:3000"}))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

 app.use('/api/auth',userRoute)


export default app;

import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
//import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import participantRoute from "./routes/participantRoute";
import restaurantRoute from "./routes/restaurantRoute";
import mealParserRoute from "./routes/mealParserRoute";

dotenv.config();

const app: Application = express();
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
//app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/participants", participantRoute);
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/meals", mealParserRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("API Running");
});

const PORT = process.env.PORT ?? 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

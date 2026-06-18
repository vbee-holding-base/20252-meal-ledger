import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute";
import participantRoute from "./routes/participantRoute";
import restaurantRoute from "./routes/restaurantRoute";
import mealParserRoute from "./routes/mealParserRoute";
import mealRoute from "./routes/mealRoute";
import debtRoute from "./routes/debtRoute";
import bankHubRoute from "./routes/bankHubRoute";
import webhookRoute from "./routes/webhookRoute";
import paymentRoute from "./routes/paymentRoute";
import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";

const app: Application = express();
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/participants", participantRoute);
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/meals", mealParserRoute);
app.use("/api/v1/meals", mealRoute);
app.use("/api/v1/debts", debtRoute);
app.use("/api/v1/bankhub", bankHubRoute);
app.use("/api/v1/webhook", webhookRoute);
app.use("/api/v1/payment", paymentRoute);
app.use(notFoundHandler);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("API Running");
});

export default app;

import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute";
import participantRoute from "./routes/participantRoute";
import restaurantRoute from "./routes/restaurantRoute";
import mealParserRoute from "./routes/mealParserRoute";
import debtRoute from "./routes/debtRoute";
import bankAccountRoute from "./routes/bankAccountRoute";
import errorHandler from "./middlewares/errorHandler";

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
app.use("/api/v1/debts", debtRoute);
app.use("/api/v1/bank-account", bankAccountRoute);

app.use(errorHandler);

export default app;

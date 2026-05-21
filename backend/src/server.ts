import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import path from "path";
import authRoute from "./routes/authRoute";
import participantRoute from "./routes/participantRoute";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

connectDB();

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/participants", participantRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("API Running");
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

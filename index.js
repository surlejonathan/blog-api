import express from "express";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

dotenv.config();

const PORT = process.env.PORT || 3010;

const app = express();

console.log("ENV", process.env.NODE_ENV);

app.set("trust proxy", process.env.NODE_ENV !== "production");

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
app.use(cookieParser());

console.log("CLIENT BASE URL", process.env.CLIENT_BASE_URL);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post(
  "/api/v1/upload",
  upload.single("uploadedImage"),
  async function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  }
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.get("/", (req, res) => {
  return res.json(
    `Server is connected + client: ${process.env.CLIENT_BASE_URL} `
  );
});
app.listen(PORT, () => {
  console.log(`Server successfully connected on port ${PORT}`);
});

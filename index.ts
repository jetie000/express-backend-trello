import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from "dotenv";

config()

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());

const run = () => {
  try {
    app.listen(PORT, () => {
      console.log(`server listening at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
run()
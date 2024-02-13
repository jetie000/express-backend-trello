import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from "dotenv";
import router from "./router/router";
import { prismaClient } from "./prisma/prismaService";

config()

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());
app.use('/api', router)

const run = () => {
  try {
    app.listen(PORT, async () => {
      console.log(`server listening at http://localhost:${PORT}`);
      await prismaClient.$connect();
    });
  } catch (e) {
    console.log(e);
  }
}
run()
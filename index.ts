import express from "express";
import cors from 'cors'

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
  });
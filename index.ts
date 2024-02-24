import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import router from "./router/router"
import { errorMiddleware } from "./middlewares/errorMiddlewares"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import { optionsSwagger } from "./config/swagger"

config()

const specs = swaggerJsdoc(optionsSwagger)

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
)
app.use("/api", router)
app.use(errorMiddleware)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
app.use("/", (req, res) => res.redirect("/api-docs"))

const run = () => {
  try {
    app.listen(PORT, async () => {
      console.log(`server listening at http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
run()

export default app

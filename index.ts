import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import { errorMiddleware } from "./middlewares/errorMiddlewares"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import { optionsSwagger } from "./config/swagger/swagger"
import { configMy } from "./config/config"
import authRouter from "./router/routesAuth"
import userRouter from "./router/routesUser"
import boardRouter from "./router/routesBoard"
import columnRouter from "./router/routesColumn"
import taskRouter from "./router/routesTask"

config()

const specs = swaggerJsdoc(optionsSwagger)

const PORT = configMy.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: configMy.CLIENT_URL
  })
)
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/board", boardRouter)
app.use("/api/column", columnRouter)
app.use("/api/task", taskRouter)

app.use(errorMiddleware)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

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

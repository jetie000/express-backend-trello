import swaggerJsdoc from "swagger-jsdoc"
import { version } from "../../package.json"
import path from "path"
import { configMy } from "../config"

export const optionsSwagger: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trello",
      version,
      description: "Trello clone REST API"
    },
    servers: [
      {
        url: configMy.API_URL + "/api"
      }
    ]
  },
  apis: [path.join(__dirname, "/*.yaml")]
}

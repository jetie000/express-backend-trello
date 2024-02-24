import swaggerJsdoc from "swagger-jsdoc"
import { version } from "../package.json"

export const optionsSwagger: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trello",
      version,
      description: "Trello clone REST API"
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./router/router.ts"]
}

import { createLogger, type Logger } from "@sdxc/logger"
import { appConfig } from "~/config/app"

export const paartLogger: Logger = createLogger({
  service: "paart-academy",
  environment: appConfig.NODE_ENV ?? "development",
  sink: appConfig.NODE_ENV === "test" ? () => {} : undefined
})

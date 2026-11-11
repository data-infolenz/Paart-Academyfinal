import { HealthCheck } from "@sdxc/health"
import { sql } from "remix/data-table"
import { db } from "./database"

export function createHealthCheck(options: { checkDatabase?: boolean } = {}) {
  const health = new HealthCheck({
    version: "1.0.0",
    description: "PAART Academy Web Service"
  })

  if (options.checkDatabase !== false) {
    health.probe("database", async () => {
      try {
        await db.exec(sql`SELECT 1`)
        return "pass"
      } catch {
        return "fail"
      }
    })
  }

  return health
}

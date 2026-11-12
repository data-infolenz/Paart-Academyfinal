import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import type { DatabaseMigrateOptions, MigrateResult } from "remix/data-table"
import { loadMigrations } from "remix/data-table/migrations/node"
import { closeDatabase, getDatabase, type PaartDb } from "~/app/initializers/database"
import { appConfig } from "~/config/app"
import { seedDatabase } from "./seed"

export async function runMigrations(
  options: DatabaseMigrateOptions = {},
  targetDb?: PaartDb
): Promise<MigrateResult> {
  const migrationsDir = resolveMigrationsDir()
  const migrations = await loadMigrations(migrationsDir)
  const db = targetDb ?? getDatabase()
  const result = await db.migrate(migrations, options)

  if ((options.direction ?? "up") === "up" && appConfig.SHOULD_SEED && !targetDb) {
    console.log("[PAART DB] SHOULD_SEED is enabled. Seeding initial PAART data...")
    await seedDatabase()
  }

  return result
}

export function resolveMigrationsDir(): string {
  const relativeDir = fileURLToPath(new URL("./migrations", import.meta.url))
  if (fs.existsSync(relativeDir)) return relativeDir
  return path.resolve(process.cwd(), "database/migrations")
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const directionArg = process.argv[2] === "down" ? "down" : "up"
  const stepArg = Number(process.argv[3] || "1")
  let exitCode = 0
  try {
    console.log(`[PAART DB] Running PostgreSQL migrations (${directionArg})...`)
    const res = await runMigrations(
      directionArg === "down" ? { direction: "down", step: stepArg } : { direction: "up" }
    )
    console.log(
      `[PAART DB] Migrations completed (${res.applied.length} applied, ${res.reverted.length} reverted).`
    )
  } catch (error) {
    console.error("[PAART DB] Migration failed:", error)
    exitCode = 1
  } finally {
    await closeDatabase().catch(() => {})
  }
  if (exitCode !== 0) {
    process.exit(exitCode)
  }
}

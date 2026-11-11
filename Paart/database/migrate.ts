import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { loadMigrations } from "remix/data-table/migrations/node"
import { closeDatabase, getDatabase } from "~/app/initializers/database"
import { appConfig } from "~/config/app"
import { seedDatabase } from "./seed"

export async function runMigrations(): Promise<void> {
  const migrationsDir = resolveMigrationsDir()
  const migrations = await loadMigrations(migrationsDir)
  const db = getDatabase()
  await db.migrate(migrations)

  if (appConfig.SHOULD_SEED) {
    console.log("[PAART DB] SHOULD_SEED is enabled. Seeding initial PAART data...")
    await seedDatabase()
  }
}

function resolveMigrationsDir(): string {
  const relativeDir = fileURLToPath(new URL("./migrations", import.meta.url))
  if (fs.existsSync(relativeDir)) return relativeDir
  return path.resolve(process.cwd(), "database/migrations")
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  let exitCode = 0
  try {
    console.log("[PAART DB] Running PostgreSQL migrations...")
    await runMigrations()
    console.log("[PAART DB] Migrations completed successfully.")
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

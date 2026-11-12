import process from "node:process"
import type { Database, TransactionOptions } from "remix/data-table"
import { createPostgresDatabase } from "remix/data-table/postgres"
import { createContextKey, type Middleware } from "remix/router"
import { appConfig } from "~/config/app"

export type PaartDb = Database<"postgres">

const globalForPaartDb = globalThis as unknown as {
  paartDbInstance?: PaartDb
}

export function getDatabasePoolConfig(): {
  max: number
  connectionTimeoutMillis: number
  idleTimeoutMillis: number
} {
  const isServerless = process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)

  if (isServerless) {
    return {
      max: 3,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10_000
    }
  }

  return {
    max: appConfig.NODE_ENV === "production" ? 20 : 10,
    connectionTimeoutMillis: 2500,
    idleTimeoutMillis: 30_000
  }
}

export function getDatabase(): PaartDb {
  if (globalForPaartDb.paartDbInstance) return globalForPaartDb.paartDbInstance

  const poolConfig = getDatabasePoolConfig()

  globalForPaartDb.paartDbInstance = createPostgresDatabase({
    connectionString: appConfig.DATABASE_URL,
    max: poolConfig.max,
    connectionTimeoutMillis: poolConfig.connectionTimeoutMillis,
    idleTimeoutMillis: poolConfig.idleTimeoutMillis
  })
  return globalForPaartDb.paartDbInstance
}

export const db: PaartDb = new Proxy({} as PaartDb, {
  get(_target, prop) {
    const instance = getDatabase()
    const value = Reflect.get(instance, prop, instance)
    return typeof value === "function" ? value.bind(instance) : value
  }
})

export function transaction<T>(
  callback: (tx: Database<"postgres">) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  return getDatabase().transaction(callback, options)
}

export async function closeDatabase(): Promise<void> {
  if (!globalForPaartDb.paartDbInstance) return
  await globalForPaartDb.paartDbInstance.close()
  globalForPaartDb.paartDbInstance = undefined
}

export const databaseContext = createContextKey<PaartDb>()

export function databaseMiddleware(): Middleware<{
  key: typeof databaseContext
  value: PaartDb
  property: "db"
}> {
  return (context, next) => {
    context.set(databaseContext, db, { property: "db" })
    return next()
  }
}

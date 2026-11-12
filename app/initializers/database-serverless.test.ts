import process from "node:process"
import { afterEach, describe, expect, it } from "vitest"
import { getDatabasePoolConfig } from "./database"

describe("Serverless Database Pool Configuration", () => {
  const originalVercel = process.env.VERCEL
  const originalLambda = process.env.AWS_LAMBDA_FUNCTION_NAME

  afterEach(() => {
    if (originalVercel !== undefined) {
      process.env.VERCEL = originalVercel
    } else {
      delete process.env.VERCEL
    }

    if (originalLambda !== undefined) {
      process.env.AWS_LAMBDA_FUNCTION_NAME = originalLambda
    } else {
      delete process.env.AWS_LAMBDA_FUNCTION_NAME
    }
  })

  it("returns lean connection pool bounds when running inside Vercel", () => {
    process.env.VERCEL = "1"
    const config = getDatabasePoolConfig()
    expect(config.max).toBe(3)
    expect(config.connectionTimeoutMillis).toBe(3000)
    expect(config.idleTimeoutMillis).toBe(10000)
  })

  it("returns standard connection pool bounds in normal non-serverless runtime", () => {
    delete process.env.VERCEL
    delete process.env.AWS_LAMBDA_FUNCTION_NAME
    const config = getDatabasePoolConfig()
    expect(config.max).toBeGreaterThanOrEqual(10)
    expect(config.connectionTimeoutMillis).toBe(2500)
    expect(config.idleTimeoutMillis).toBe(30000)
  })
})

import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const USER_ROLES = ["admin", "faculty", "aspirant"] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_STATUSES = ["active", "suspended"] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export const users = table({
  name: "users",
  columns: {
    id: col.text().primaryKey(),
    email: col.text().notNull().unique(),
    full_name: col.text().notNull(),
    phone: col.text().notNull().default(""),
    department: col.text().notNull().default(""),
    role: col.text<UserRole>().notNull(),
    password_hash: col.text().notNull(),
    must_change_password: col.boolean().notNull().default(true),
    status: col.text<UserStatus>().notNull().default("active"),
    last_login_at: col.timestamp().nullable(),
    credentials_sent_at: col.timestamp().nullable(),
    credentials_delivery_error: col.text().nullable(),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export const sessions = table({
  name: "sessions",
  columns: {
    id: col.text().primaryKey(),
    user_id: col.text().notNull(),
    token_hash: col.text().notNull().unique(),
    ip_address: col.text().notNull().default(""),
    user_agent: col.text().notNull().default(""),
    expires_at: col.timestamp().notNull(),
    created_at: col.timestamp().notNull().defaultNow()
  }
})

export type UserRow = InferSelect<typeof users>
export type NewUserRow = InferInsert<typeof users>
export type SessionRow = InferSelect<typeof sessions>
export type NewSessionRow = InferInsert<typeof sessions>

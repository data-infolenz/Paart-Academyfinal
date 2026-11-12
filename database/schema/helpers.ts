import { type AnyTable, type ColumnBuilder, column as c, type TableRow } from "remix/data-table"

export const col = {
  text<T extends string = string>(): ColumnBuilder<T> {
    return c.text() as unknown as ColumnBuilder<T>
  },
  integer(): ColumnBuilder<number> {
    return c.integer()
  },
  decimal(precision = 6, scale = 2): ColumnBuilder<number> {
    return c.decimal(precision, scale)
  },
  boolean(): ColumnBuilder<boolean> {
    return c.boolean()
  },
  timestamp(): ColumnBuilder<Date> {
    return c.timestamp({ withTimezone: true }) as unknown as ColumnBuilder<Date>
  },
  json<T = unknown>(): ColumnBuilder<T> {
    return c.json() as unknown as ColumnBuilder<T>
  }
}

export type InferSelect<T extends AnyTable> = TableRow<T>
export type InferInsert<T extends AnyTable> = Partial<TableRow<T>>

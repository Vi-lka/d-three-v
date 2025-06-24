import { index } from "drizzle-orm/pg-core";

import createTable, { numericCasted } from "../utils";

import { users } from ".";

export const models = createTable(
  "model",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .varchar({ length: 255 })
      .references(() => users.id, { onDelete: "set null" }),
    name: d.varchar({ length: 255 }).notNull(),
    originalName: d.varchar({ length: 255 }).notNull(),
    description: d.text(),
    fileSize: numericCasted("fileSize", {
      precision: 100,
      scale: 20,
    }).notNull(),
    fileUrl: d.text().notNull(),
    imageUrl: d.text().notNull(),
    createdAt: d
      .timestamp("created_at", {
        mode: "date",
        withTimezone: true,
      })
      .defaultNow()
      .notNull(),
    updatedAt: d
      .timestamp("updated_at", {
        mode: "date",
        withTimezone: true,
      })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index("model_user_id_idx").on(t.userId)],
);

export type Model = typeof models.$inferSelect;

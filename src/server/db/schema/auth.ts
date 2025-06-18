import { sql } from "drizzle-orm";
import { index, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import createTable from "../utils";

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  createdAt: d.timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow().$onUpdate(() => new Date()).notNull(),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
)

export const authenticators = createTable(
  "authenticator",
  (d) => ({
    credentialID: d.text().notNull().unique(),
    userId: d.text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: d.text().notNull(),
    credentialPublicKey: d.text().notNull(),
    counter: d.integer().notNull(),
    credentialDeviceType: d.text().notNull(),
    credentialBackedUp: d.boolean().notNull(),
    transports: d.text(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.credentialID] })],
)

export type User = typeof users.$inferSelect
export type Session = typeof sessions.$inferSelect

export interface SessionExtend extends Session {
  name: User["name"],
  email: User["email"],
}

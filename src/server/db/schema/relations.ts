import { relations } from "drizzle-orm";
import { 
  accounts, 
  authenticators, 
  models, 
  sessions, 
  users 
} from ".";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  models: many(models),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, { fields: [authenticators.userId], references: [users.id] }),
}));

export const modelsRelations = relations(models, ({ one }) => ({
  user: one(users, { fields: [models.userId], references: [users.id] }),
}));
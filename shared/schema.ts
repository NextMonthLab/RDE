import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  template: text("template").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  settings: jsonb("settings").$type<{
    theme?: string;
    tabSize?: number;
    wordWrap?: boolean;
  }>().default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  content: text("content").default(""),
  isDirectory: boolean("is_directory").default(false).notNull(),
  parentId: integer("parent_id").references((): any => files.id),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const terminalSessions = pgTable("terminal_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  sessionId: text("session_id").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  files: many(files),
  terminalSessions: many(terminalSessions),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
  children: many(files),
}));

export const terminalSessionsRelations = relations(terminalSessions, ({ one }) => ({
  project: one(projects, {
    fields: [terminalSessions.projectId],
    references: [projects.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  template: true,
  settings: true,
});

export const insertFileSchema = createInsertSchema(files).pick({
  name: true,
  path: true,
  content: true,
  isDirectory: true,
  parentId: true,
});

export const updateFileSchema = createInsertSchema(files).pick({
  name: true,
  content: true,
}).partial();

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type FileNode = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type UpdateFile = z.infer<typeof updateFileSchema>;

export type TerminalSession = typeof terminalSessions.$inferSelect;

import { users, projects, files, terminalSessions, type User, type InsertUser, type Project, type InsertProject, type FileNode, type InsertFile, type UpdateFile, type TerminalSession } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // File operations
  getFile(id: number): Promise<FileNode | undefined>;
  getFilesByProject(projectId: number): Promise<FileNode[]>;
  getFileByPath(projectId: number, path: string): Promise<FileNode | undefined>;
  createFile(file: InsertFile & { projectId: number }): Promise<FileNode>;
  updateFile(id: number, updates: UpdateFile): Promise<FileNode | undefined>;
  deleteFile(id: number): Promise<boolean>;
  getFileTree(projectId: number): Promise<FileNode[]>;

  // Terminal session operations
  createTerminalSession(projectId: number, sessionId: string): Promise<TerminalSession>;
  getTerminalSession(sessionId: string): Promise<TerminalSession | undefined>;
  deactivateTerminalSession(sessionId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async createProject(project: InsertProject & { userId: number }): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  // File operations
  async getFile(id: number): Promise<FileNode | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async getFilesByProject(projectId: number): Promise<FileNode[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.projectId, projectId));
  }

  async getFileByPath(projectId: number, path: string): Promise<FileNode | undefined> {
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.projectId, projectId), eq(files.path, path)));
    return file || undefined;
  }

  async createFile(file: InsertFile & { projectId: number }): Promise<FileNode> {
    const [newFile] = await db
      .insert(files)
      .values(file)
      .returning();
    return newFile;
  }

  async updateFile(id: number, updates: UpdateFile): Promise<FileNode | undefined> {
    const [updated] = await db
      .update(files)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteFile(id: number): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return result.rowCount > 0;
  }

  async getFileTree(projectId: number): Promise<FileNode[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.projectId, projectId));
  }

  // Terminal session operations
  async createTerminalSession(projectId: number, sessionId: string): Promise<TerminalSession> {
    const [session] = await db
      .insert(terminalSessions)
      .values({ projectId, sessionId })
      .returning();
    return session;
  }

  async getTerminalSession(sessionId: string): Promise<TerminalSession | undefined> {
    const [session] = await db
      .select()
      .from(terminalSessions)
      .where(eq(terminalSessions.sessionId, sessionId));
    return session || undefined;
  }

  async deactivateTerminalSession(sessionId: string): Promise<boolean> {
    const result = await db
      .update(terminalSessions)
      .set({ isActive: false })
      .where(eq(terminalSessions.sessionId, sessionId));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();

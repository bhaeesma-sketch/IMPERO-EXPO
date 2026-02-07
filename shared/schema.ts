import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, pgEnum, timestamp, real, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productTypeEnum = pgEnum("product_type", ["bullion", "jewelry"]);
export const productCategoryEnum = pgEnum("product_category", ["coins", "bars", "silver", "jewelry"]);
export const availabilityEnum = pgEnum("availability", ["In Stock", "Out of Stock", "Made to Order"]);
export const purityEnum = pgEnum("purity", ["18K", "21K", "22K", "24K", "Silver"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  image: text("image").notNull(),
  images: text("images").array(),
  purity: purityEnum("purity").notNull(),
  baseWeight: integer("base_weight").notNull(),
  displayWeight: text("display_weight"),
  customWeights: integer("custom_weights").array(),
  makingCharge: integer("making_charge").notNull(),
  type: productTypeEnum("type").notNull(),
  category: productCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  manufacturer: text("manufacturer").notNull(),
  availability: availabilityEnum("availability").notNull(),
  productCode: text("product_code").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const updateProductSchema = createInsertSchema(products).partial().omit({
  id: true,
});

export const goldPriceHistory = pgTable("gold_price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  price24k: real("price_24k").notNull(),
  price22k: real("price_22k").notNull(),
  price21k: real("price_21k").notNull(),
  price18k: real("price_18k").notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'PAGE_VIEW', 'CLICK', 'LOGIN', etc.
  userId: text("user_id"), // Nullable, as visitors might not be logged in
  details: jsonb("details"), // Store path, button ID, etc.
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertGoldPriceHistorySchema = createInsertSchema(goldPriceHistory).omit({
  id: true,
  timestamp: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertGoldPriceHistory = z.infer<typeof insertGoldPriceHistorySchema>;
export type GoldPriceHistory = typeof goldPriceHistory.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

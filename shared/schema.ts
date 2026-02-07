import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, pgEnum, timestamp, real, serial, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productTypeEnum = pgEnum("product_type", ["bullion", "jewelry"]);
export const productCategoryEnum = pgEnum("product_category", ["coins", "bars", "silver", "jewelry"]);
export const availabilityEnum = pgEnum("availability", ["In Stock", "Out of Stock", "Made to Order"]);
export const purityEnum = pgEnum("purity", ["18K", "21K", "22K", "24K", "Silver"]);
export const alertConditionEnum = pgEnum("alert_condition", ["below", "above"]);
export const notificationTypeEnum = pgEnum("notification_type", ["gold_alert", "new_product", "wishlist_price", "system"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  preferredLanguage: text("preferred_language").default("en").notNull(),
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

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("wishlist_user_product_idx").on(table.userId, table.productId),
]);

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  payload: jsonb("payload"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const goldRateAlerts = pgTable("gold_rate_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  purity: text("purity").notNull(),
  targetPrice: real("target_price").notNull(),
  condition: alertConditionEnum("condition").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastTriggeredAt: timestamp("last_triggered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  eventType: text("event_type").notNull(),
  userId: text("user_id"),
  details: jsonb("details"),
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

export const insertWishlistSchema = createInsertSchema(wishlists).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertGoldRateAlertSchema = createInsertSchema(goldRateAlerts).omit({
  id: true,
  createdAt: true,
  lastTriggeredAt: true,
  isActive: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertGoldPriceHistory = z.infer<typeof insertGoldPriceHistorySchema>;
export type GoldPriceHistory = typeof goldPriceHistory.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type GoldRateAlert = typeof goldRateAlerts.$inferSelect;
export type InsertGoldRateAlert = z.infer<typeof insertGoldRateAlertSchema>;

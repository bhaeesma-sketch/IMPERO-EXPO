import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("Error: ADMIN_PASSWORD environment variable is required");
    console.error("Please set ADMIN_PASSWORD as a secret in your Replit project");
    process.exit(1);
  }

  const existing = await db.select().from(users).where(eq(users.username, adminUsername));
  
  if (existing.length > 0) {
    console.log("Admin user already exists");
    
    await db.update(users)
      .set({ isAdmin: true })
      .where(eq(users.username, adminUsername));
    
    console.log("Updated existing user to admin");
    process.exit(0);
  }

  const hashedPassword = await hashPassword(adminPassword);
  
  await db.insert(users).values({
    username: adminUsername,
    password: hashedPassword,
    isAdmin: true,
  });

  console.log("Admin user created!");
  console.log(`Username: ${adminUsername}`);
  console.log("\nPlease change the password after first login.");
  
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});

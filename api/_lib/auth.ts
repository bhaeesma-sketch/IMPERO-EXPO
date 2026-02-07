import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split(".");
    const buf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(buf, suppliedBuf);
}

export async function getUser(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
}

export function signToken(user: typeof users.$inferSelect) {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
        return null;
    }
}

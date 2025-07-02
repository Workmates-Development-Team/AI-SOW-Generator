import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import jwt from "jsonwebtoken";
import type { QueryCtx } from "./_generated/server";

async function validateJwt(token: string): Promise<{ email: string } | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in Convex environment variables.");
      return null;
    }
    const decoded = jwt.verify(token, secret) as { email: string };
    return decoded;
  } catch (error) {
    console.error("JWT validation failed:", error);
    return null;
  }
}

export const getIdentity = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx: QueryCtx, { token }: { token?: string }) => {
    if (!token) {
      return null;
    }

    const decodedToken = await validateJwt(token);

    if (!decodedToken || !decodedToken.email) {
      return null;
    }

    const email = decodedToken.email;
    const tokenIdentifier = `jwt-user-${email}`;

    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    return user;
  },
});

export const logout = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenIdentifier) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) {
      return null;
    }
    await ctx.db.patch(user._id, { tokenIdentifier: "" });
    return true;
  },
});

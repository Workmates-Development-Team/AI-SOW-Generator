import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found. Please sign up.");
    }
    return user.tokenIdentifier;
  },
});

export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(), // For local dev, a simple password check
  },
  handler: async (ctx, { email, password }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingUser) {
      throw new Error("User with this email already exists. Please log in.");
    }

    const userId = await ctx.db.insert("users", {
      name: email.split("@")[0] ?? "user",
      email,
      tokenIdentifier: `local-user-${email}`,
    });

    return `local-user-${email}`;
  },
});

export const logout = mutation({
  args: {},
  handler: async (ctx) => {
    return true;
  },
});

export const getIdentity = query({
  args: { tokenIdentifier: v.optional(v.string()) },
  handler: async (ctx, { tokenIdentifier }) => {
    if (!tokenIdentifier) {
      return null;
    }
    // For local auth, the tokenIdentifier is the key to finding the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .unique();
    return user;
  },
});
